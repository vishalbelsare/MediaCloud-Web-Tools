import logging
from flask import jsonify, request
import flask_login
from multiprocessing import Pool
from operator import itemgetter

from server.cache import cache
from media_search import _matching_collections_by_set, media_search, _matching_sources_by_set
from server import app, mc
from server.auth import user_mediacloud_client, user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS
from server.views.sources import FEATURED_COLLECTION_LIST
from server.util.request import api_error_handler, arguments_required
from server.util.tags import _cached_media_with_tag_page

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)
STORY_COUNT_POOL_SIZE = 10  # number of parallel processes to use while fetching historical sentence counts for each media source

def source_details_worker(info):
    user_mc = user_mediacloud_client()
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
@arguments_required('media_keyword')
@api_error_handler
def api_mediapicker_source_search():
    use_pool = False
    search_str = request.args['media_keyword']
    cleaned_search_str = None if search_str == '*' else search_str
    tags = None
    if 'tags[]' in request.args:
        tags = request.args['tags[]'].split(',')
    results = _matching_sources_by_set(cleaned_search_str, tags)  # from a pool
    trimmed_sources = [r[:MAX_SOURCES] for r in results]
    flat_list_of_sources = [item for sublist in trimmed_sources for item in sublist]
    set_of_queried_sources = []
    if len(flat_list_of_sources) > 0:
        if use_pool:
            pool = Pool(processes=STORY_COUNT_POOL_SIZE)
            set_of_queried_sources = pool.map(source_details_worker, flat_list_of_sources)
            pool.close()
        else:
            set_of_queried_sources = [source_details_worker(s) for s in flat_list_of_sources]
    set_of_queried_sources = sorted(set_of_queried_sources, key=itemgetter('story_count'), reverse=True)
    return jsonify({'list': set_of_queried_sources})


def _cached_collection_recent_story_count(tags_id):
    # user-agnostic cache here becasue it is not user-epcific data
    user_mc = user_mediacloud_client()
    collection_story_query = "tags_id_media:({}) AND (+publish_date: [NOW-7DAY TO NOW])".format(tags_id)
    recent_story_count= user_mc.storyCount(collection_story_query)['count']
    return recent_story_count


def collection_details_worker(info):
    recent_story_count = _cached_collection_recent_story_count(info['tags_id'])
    total_sources = len(_cached_media_with_tag_page(info['tags_id'], 0))
    coll_data = {
        'type': info['tag_set_label'],
        'label': info['label'] or info['tag'],
        'story_count': recent_story_count,
        'media_count': total_sources,
    }
    info.update(coll_data)
    return info


@app.route('/api/mediapicker/collections/search', methods=['GET'])
@flask_login.login_required
@arguments_required('media_keyword', 'which_set')
@api_error_handler
def api_mediapicker_collection_search():
    use_pool = False
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    search_str = request.args['media_keyword']
    which_set = request.args['which_set'].split(',')
    results = _matching_collections_by_set(search_str, public_only, which_set)
    trimmedSet = MAX_COLLECTIONS
    trimmed_collections = results[:trimmedSet]
    # flat_list_of_collections = [item for sublist in trimmed_collections for item in sublist]
    set_of_queried_collections = []
    if len(trimmed_collections) > 0:
        if use_pool:
            pool = Pool(processes=STORY_COUNT_POOL_SIZE)
            set_of_queried_collections = pool.map(collection_details_worker, trimmed_collections)
            pool.close()
        else:
            set_of_queried_collections = [collection_details_worker(c) for c in trimmed_collections]
    set_of_queried_collections = sorted(set_of_queried_collections, key=itemgetter('story_count'), reverse=True)
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
