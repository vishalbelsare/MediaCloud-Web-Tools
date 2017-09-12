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


def _source_story_counts_worker(info):
    source = info['media']
    media_query = "(media_id:{}) {}".format(source['media_id'], info['q'])
    total_story_count = _cached_source_story_count(user_mediacloud_key(), media_query)

    source_data = {
        'media_id': source['media_id'],
        'media_name': source['name'],
        'media_url': source['url'],
        'total_stories': total_story_count,
    }
    return source_data


def _collection_source_story_counts(collection_id):
    user_mc = user_admin_mediacloud_client()
    one_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=7)
    start_date = one_weeks_before_now
    end_date = datetime.datetime.now()

    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str =  end_date.strftime("%Y-%m-%d")
    q = " AND ({})".format(user_mc.publish_date_query(start_date, end_date))
    media_list = _cached_media_with_tag_page(collection_id, 0) # paging through all of it?
    jobs = [{'media': m, 'q': q, 'start_date_str': start_date_str, 'end_date_str': end_date_str} for m in media_list]

    # fetch in parallel to make things faster
    pool = Pool(processes=STORY_COUNT_POOL_SIZE)
    results = pool.map(_source_story_counts_worker, jobs)  # blocks until they are all done
    pool.terminate()  # extra safe garbage collection
    return results


@app.route('/api/mediapicker/collections/search', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaKeyword')
@api_error_handler
def api_mediapicker_collection_search():
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    search_str = request.args['mediaKeyword']
    results = _matching_tags_by_set(search_str, public_only)
    trimmed_collections = [r[:MAX_COLLECTIONS] for r in results]
    flat_list = [item for sublist in trimmed_collections for item in sublist]

    set_of_queried_collections = []
    how_lively_is_this_collection = 0

    one_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=7)
    start_date = one_weeks_before_now
    end_date = datetime.datetime.now()
    for coll in flat_list:
        tags_id = coll['tags_id']
        
        how_lively_is_this_collection += len(_collection_source_story_counts(tags_id))

        coll['story_count'] = how_lively_is_this_collection
        set_of_queried_collections.append(coll)
    return jsonify({'list': set_of_queried_collections})

