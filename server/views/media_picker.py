import logging
from flask import jsonify, request
import flask_login
from multiprocessing import Pool
from media_search import media_search, _matching_tags_by_set
from server import app, mc, db
from server.util.request import arguments_required, api_error_handler
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_name, user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS
from server.views.sources import _cached_source_story_count
from server.views.sources.favorites import add_user_favorite_flag_to_sources

from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.util.tags import _cached_media_with_tag_page
import datetime

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)
STORY_COUNT_POOL_SIZE = 10  # number of parallel processes to use while fetching historical sentence counts for each media source

# TODO there are two very similar calls in sources/search.py - string vs arguments passed. may need args so not yet extracting

@app.route('/api/mediapicker/sources/search', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaKeyword')
@api_error_handler
def api_mediapicker_source_search():
    tags = None
    search_str = request.args['mediaKeyword']
    cleaned_search_str = None if search_str == '*' else search_str
    if 'tags[]' in request.args:
        tags = request.args['tags[]'].split(',')
    if tags is None:
        source_list = media_search(cleaned_search_str)[:MAX_SOURCES]
    else:
        source_list = media_search(cleaned_search_str, tags_id=tags[0])[:MAX_SOURCES]
    add_user_favorite_flag_to_sources(source_list)
    return jsonify({'list':source_list})


def collection_details_worker(info):
    user_mc = user_admin_mediacloud_client()
    collection_story_query = "tags_id_media:({}) AND (+publish_date: [NOW-7DAY TO NOW])".format(info['tags_id'])
    total_story_count = user_mc.storyCount(collection_story_query)['count']
    total_sources = len(_cached_media_with_tag_page(info['tags_id'], 0))
    coll_data = {
        'tags_id': info['tags_id'],
        'label': info['label'],
        'description': info['tag_set_description'],
        'story_count': total_story_count,
        'media_count': total_sources,
    }
    return coll_data


@app.route('/api/mediapicker/collections/search', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaKeyword')
@api_error_handler
def api_mediapicker_collection_search():
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    search_str = request.args['mediaKeyword']
    results = _matching_tags_by_set(search_str, public_only) # from pool
    trimmed_collections = [r[:MAX_COLLECTIONS] for r in results]
    flat_list_of_collections = [item for sublist in trimmed_collections for item in sublist]

    pool = Pool(processes=STORY_COUNT_POOL_SIZE)
    set_of_queried_collections = pool.map(collection_details_worker, flat_list_of_collections)
    pool.terminate()  # extra s

    return jsonify({'list': set_of_queried_collections})


