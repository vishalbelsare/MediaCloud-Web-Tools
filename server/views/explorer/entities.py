import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, is_user_logged_in
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS, processed_by_cliff_query_clause
from server.util.request import api_error_handler
import server.util.csv as csv
from server.views.explorer import parse_as_sample, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import json
logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE= 1000
DEFAULT_DISPLAY_AMOUNT= 10

ENTITY_DOWNLOAD_COLUMNS = ['label', 'count', 'pct', 'sample_size','tags_id']


# @cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_entities(query, type):
    if is_user_logged_in():   # no user session
        api_client = user_admin_mediacloud_client()
    else:
        api_client = mc
    return api_client.sentenceFieldCount('*', query, field='tags_id_stories', tag_sets_id=type, sample_size=DEFAULT_SAMPLE_SIZE)


def top_tags_in_set(solr_query, tag_type, display_size):

    sentence_count_results = _cached_entities(solr_query, tag_type)
    top_count_results = sentence_count_results[:display_size]
    return top_count_results


def get_CLIFF_coverage_for_query(solr_query):
    if is_user_logged_in():   # no user session
        api_client = user_admin_mediacloud_client()
    else:
        api_client = mc
    solr_query += ' AND {}'.format(processed_by_cliff_query_clause())
    return api_client.storyCount(solr_query=solr_query)


def process_tags_for_coverage(solr_query, tag_counts):
    if is_user_logged_in():   # no user session
        api_client = user_admin_mediacloud_client()
    else:
        api_client = mc
    story_count_total = api_client.storyCount(solr_query=solr_query)
    story_count_cliff = get_CLIFF_coverage_for_query(solr_query)

    coverage={}
    coverage['total'] = story_count_total['count']
    coverage['counts'] = story_count_cliff['count']
    for t in tag_counts:  # add in pct of what's been run through CLIFF to total results
        t['pct'] = float(t['count']) / DEFAULT_SAMPLE_SIZE #indivi count over sampe sie
    coverage['coverage_percentage'] = float(story_count_cliff['count']) / float(story_count_total['count'])  # indivi count over sampe sie
    coverage['results'] = tag_counts
    return coverage


@app.route('/api/explorer/entities/people', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_entities_people():
    solr_query = parse_query_with_keywords(request.args)
    top_tag_counts = top_tags_in_set(solr_query, CLIFF_PEOPLE, DEFAULT_DISPLAY_AMOUNT)
    return jsonify(process_tags_for_coverage(solr_query, top_tag_counts))


@app.route('/api/explorer/entities/organizations', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_entities_organizations():
    solr_query = parse_query_with_keywords(request.args)
    top_tag_counts = top_tags_in_set(solr_query, CLIFF_ORGS, DEFAULT_DISPLAY_AMOUNT)
    return jsonify(process_tags_for_coverage(solr_query, top_tag_counts))

@app.route('/api/explorer/demo/entities/people', methods=['GET'])
@api_error_handler
def api_explorer_demo_top_entities_people():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)
 
    top_tag_counts = top_tags_in_set(solr_query, CLIFF_PEOPLE, DEFAULT_DISPLAY_AMOUNT)
    return jsonify(process_tags_for_coverage(solr_query, top_tag_counts))


@app.route('/api/explorer/demo/entities/organizations', methods=['GET'])
@api_error_handler
def api_explorer_demo_top_entities_organizations():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None

    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)

    top_tag_counts = top_tags_in_set(solr_query, CLIFF_ORGS, DEFAULT_DISPLAY_AMOUNT)
    return jsonify(process_tags_for_coverage(solr_query, top_tag_counts))

@app.route('/api/explorer/entities/<type_entity>/entities.csv/<search_id_or_query>/<index>', methods=['GET'])
@api_error_handler
def explorer_entities_csv(type_entity, search_id_or_query, index):
    tag_type = CLIFF_PEOPLE if type_entity == 'people' else CLIFF_ORGS
    fn = 'explorer-entities-{}'.format(type_entity)
    try:
        search_id = int(search_id_or_query)
        if search_id >= 0: # this is a sample query
            solr_query = parse_as_sample(search_id, index)
            # TODO 
            filename = fn #+ current_query['q']

    except Exception as e: 
        # planned exception if search_id is actually a keyword or query
        # csv downloads are 1:1 - one query to one download, so we can use index of 0
        query_or_keyword = search_id_or_query
        current_query = json.loads(query_or_keyword)[0]
        filename = fn + current_query['q']
        solr_query = parse_query_with_keywords(current_query)

    top_tag_counts = top_tags_in_set(solr_query, tag_type, DEFAULT_SAMPLE_SIZE)
    top_tag_counts = process_tags_for_coverage(solr_query, top_tag_counts)['results']
    for tag in top_tag_counts:
        tag['sample_size'] = DEFAULT_SAMPLE_SIZE

    return csv.stream_response(top_tag_counts, ENTITY_DOWNLOAD_COLUMNS,
                               filename.format(type_entity))
