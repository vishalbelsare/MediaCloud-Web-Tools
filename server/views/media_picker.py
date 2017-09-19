import logging
from flask import jsonify, request
import flask_login
from multiprocessing import Pool
from server.cache import cache
from media_search import _matching_collections_by_set, _matching_sources_by_set
from server import app, mc
from server.auth import user_admin_mediacloud_client, user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS
from server.views.sources import FEATURED_COLLECTION_LIST
from server.util.request import api_error_handler, arguments_required
from server.util.tags import _cached_media_with_tag_page

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)
STORY_COUNT_POOL_SIZE = 10  # number of parallel processes to use while fetching historical sentence counts for each media source

# TODO there are two very similar calls in sources/search.py - overall _ vs camelcase, and then args vs vs


def source_details_worker(info):
    user_mc = user_admin_mediacloud_client()
    source_story_query = "media_id:({}) AND (+publish_date: [NOW-7DAY TO NOW])".format(info['media_id'])
    total_story_count = user_mc.storyCount(source_story_query)['count']
    coll_data = {
        'media_id': info['media_id'],
        'label': info['name'],
        'name': info['name'],
        'url': info['url'],
        'public_notes': info['public_notes'],
        'story_count': total_story_count,
    }
    return coll_data


@app.route('/api/mediapicker/sources/search', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaKeyword')
@api_error_handler
def api_mediapicker_source_search():
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    search_str = request.args['mediaKeyword']
    results = _matching_sources_by_set(search_str, public_only)  # from pool
    trimmed_sources = [r[:MAX_SOURCES] for r in results]
    flat_list_of_sources = [item for sublist in trimmed_sources for item in sublist]
    set_of_queried_sources = []
    if len(flat_list_of_sources) > 0:
        pool = Pool(processes=STORY_COUNT_POOL_SIZE)
        set_of_queried_sources = pool.map(source_details_worker, flat_list_of_sources)
        pool.close()

    return jsonify({'list': set_of_queried_sources})


def collection_details_worker(info):
    user_mc = user_admin_mediacloud_client()
    collection_story_query = "tags_id_media:({}) AND (+publish_date: [NOW-7DAY TO NOW])".format(info['tags_id'])
    total_story_count = user_mc.storyCount(collection_story_query)['count']
    total_sources = len(_cached_media_with_tag_page(info['tags_id'], 0))
    coll_data = {
        'type': info['tag_set_label'],
        'label': info['label'] or info['tag'],
        'story_count': total_story_count,
        'media_count': total_sources,
    }
    info.update(coll_data)
    return info


@app.route('/api/mediapicker/collections/search', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaKeyword')
@api_error_handler
def api_mediapicker_collection_search():
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    search_str = request.args['mediaKeyword']
    results = _matching_collections_by_set(search_str, public_only)  # from pool
    trimmed_collections = [r[:MAX_COLLECTIONS] for r in results]
    flat_list_of_collections = [item for sublist in trimmed_collections for item in sublist]
    set_of_queried_collections = []
    if len(flat_list_of_collections) > 0:
        pool = Pool(processes=STORY_COUNT_POOL_SIZE)
        set_of_queried_collections = pool.map(collection_details_worker, flat_list_of_collections)
        pool.close()

    return jsonify({'list': set_of_queried_collections})


@app.route('/api/mediapicker/collections/featured', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_featured_collections():
    featured_collections = _cached_featured_collection_list()
    return jsonify({'results': featured_collections})


@cache
def _cached_featured_collection_list():
    featured_collections = []
    for tags_id in FEATURED_COLLECTION_LIST:
        coll = mc.tag(tags_id)
        coll['id'] = tags_id
        featured_collections.append(coll)
    pool = Pool(processes=STORY_COUNT_POOL_SIZE)
    set_of_queried_collections = pool.map(collection_details_worker, featured_collections)
    pool.close()
    return set_of_queried_collections
