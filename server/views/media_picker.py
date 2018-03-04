import logging
from flask import jsonify, request
import flask_login
from multiprocessing import Pool
from operator import itemgetter
import time

from server.cache import cache, key_generator
from media_search import collection_search
from server import app, mc
from server.auth import user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS
from server.views.sources import FEATURED_COLLECTION_LIST
from server.util.request import api_error_handler, arguments_required
from server.util.tags import cached_media_with_tag_page

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)
STORY_COUNT_POOL_SIZE = 10  # number of parallel processes to use while fetching historical sentence counts for sources


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_media_health(media_id):
    # this is cached across al users, so we can use the tool-level API client object
    return mc.mediaHealth(media_id)


def source_details_worker(info):
    health = _cached_media_health(info['media_id'])  # this has aggregate story counts to use instead of querying for them
    weekly_story_count = 0 if len(health) is 0 else int(health['num_stories_w']) # sometimes health is an empty list - WTF
    collection_info = {
        'media_id': info['media_id'],
        'label': info['name'],
        'name': info['name'],
        'url': info['url'],
        'public_notes': info['public_notes'],
        'weekly_story_count': weekly_story_count,
    }
    return collection_info


@app.route('/api/mediapicker/sources/search', methods=['GET'])
@flask_login.login_required
@arguments_required('media_keyword')
@api_error_handler
def api_mediapicker_source_search():
    t0 = time.time()
    use_pool = True
    search_str = request.args['media_keyword']
    cleaned_search_str = None if search_str == '*' else search_str
    tags = None
    if 'tags' in request.args:
        tags = request.args['tags'].split(',')
    t1 = time.time()
    matching_sources = mc.mediaList(name_like=cleaned_search_str, tags_id=tags, rows=MAX_SOURCES)
    t2 = time.time()
    if use_pool:
        pool = Pool(processes=STORY_COUNT_POOL_SIZE)
        matching_sources = pool.map(source_details_worker, matching_sources)
        pool.close()
    else:
        matching_sources = [source_details_worker(s) for s in matching_sources]
    t3 = time.time()
    matching_sources = sorted(matching_sources, key=itemgetter('weekly_story_count'), reverse=True)
    t4 = time.time()
    logger.debug("total: {}".format(t4 - t0))
    logger.debug("  load: {}".format(t1-t0))
    logger.debug("  search: {}".format(t2 - t1))
    logger.debug("  source_health: {}".format(t3 - t2))
    logger.debug("  sort: {}".format(t4 - t3))
    return jsonify({'list': matching_sources})


def collection_details_worker(info):
    total_sources = len(cached_media_with_tag_page(info['tags_id'], 0))
    coll_data = {
        'type': info['tag_set_label'],
        'label': info['label'] or info['tag'],
        'media_count': total_sources,
    }
    info.update(coll_data)
    return info


@app.route('/api/mediapicker/collections/search', methods=['GET'])
@flask_login.login_required
@arguments_required('media_keyword', 'which_set')
@api_error_handler
def api_mediapicker_collection_search():
    t0 = time.time()
    use_pool = True
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    search_str = request.args['media_keyword']
    tag_sets_id_list = request.args['which_set'].split(',')
    t1 = time.time()
    results = collection_search(search_str, public_only, tag_sets_id_list)
    t2 = time.time()
    trimmed_collections = results[:MAX_COLLECTIONS]
    # flat_list_of_collections = [item for sublist in trimmed_collections for item in sublist]
    set_of_queried_collections = []
    if len(trimmed_collections) > 0:
        if use_pool:
            pool = Pool(processes=STORY_COUNT_POOL_SIZE)
            set_of_queried_collections = pool.map(collection_details_worker, trimmed_collections)
            pool.close()
        else:
            set_of_queried_collections = [collection_details_worker(c) for c in trimmed_collections]
    t3 = time.time()
    set_of_queried_collections = sorted(set_of_queried_collections, key=itemgetter('media_count'), reverse=True)
    t4 = time.time()
    logger.debug("total: {}".format(t4 - t0))
    logger.debug("  load: {}".format(t1-t0))
    logger.debug("  search: {}".format(t2 - t1))
    logger.debug("  media_count: {}".format(t3 - t2))
    logger.debug("  sort: {}".format(t4 - t3))
    return jsonify({'list': set_of_queried_collections})


@app.route('/api/mediapicker/collections/featured', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_featured_collections():
    featured_collections = _cached_featured_collection_list(FEATURED_COLLECTION_LIST)
    return jsonify({'results': featured_collections})


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_featured_collection_list(tag_id_list):
    use_pool = True
    featured_collections = []
    for tags_id in tag_id_list:
        coll = mc.tag(tags_id)
        coll['id'] = tags_id
        featured_collections.append(coll)
    if use_pool:
        pool = Pool(processes=STORY_COUNT_POOL_SIZE)
        set_of_queried_collections = pool.map(collection_details_worker, featured_collections)
        pool.close()
    else:
        set_of_queried_collections = [collection_details_worker(c) for c in featured_collections]
    return set_of_queried_collections
