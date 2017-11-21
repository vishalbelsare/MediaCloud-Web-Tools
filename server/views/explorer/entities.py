import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, is_user_logged_in
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS, CLIFF_CLAVIN_2_3_0_TAG_ID
from server.util.request import api_error_handler
from server.views.topics.apicache import topic_tag_coverage
import server.util.csv as csv
from server.views.explorer import parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
import json
logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE= 1000
DEFAULT_DISPLAY_AMOUNT= 10

ENTITY_DOWNLOAD_COLUMNS = ['label', 'count', 'pct', 'sample_size','tags_id']


# @cache
def _cached_entities(query, type):
    if is_user_logged_in():   # no user session
        api_client = user_admin_mediacloud_client()
    else:
        api_client = mc
    return api_client.sentenceFieldCount('*', query, field='tags_id_stories', tag_sets_id=type, sample_size=DEFAULT_SAMPLE_SIZE)


def top_tags_in_set(solr_query, tag_type, display_size):
    user_mc_key = user_mediacloud_key()

    sentence_count_results = _cached_entities(solr_query, tag_type)
    top_count_results = sentence_count_results[:display_size]
    return top_count_results


def get_CLIFF_coverage_for_query(solr_query):
    if is_user_logged_in():   # no user session
        api_client = user_admin_mediacloud_client()
    else:
        api_client = mc
    solr_query += ' AND tags_id_stories:{}'.format(CLIFF_CLAVIN_2_3_0_TAG_ID)
    return api_client.storyCount(solr_query=solr_query)

def process_tags_for_coverage(solr_query, tag_counts):
    user_mc = user_admin_mediacloud_client()
    story_count_total = user_mc.storyCount(solr_query=solr_query)
    story_count_cliff = get_CLIFF_coverage_for_query(solr_query)

    coverage={}
    coverage['total'] = story_count_total['count']
    coverage['counts'] = story_count_cliff['count']
    for t in tag_counts:  # add in pct of what's been run through CLIFF to total results
        t['pct'] = float(story_count_cliff['count']) / float(story_count_total['count'])
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
 
    top_tag_counts = top_tags_in_set(solr_query, CLIFF_PEOPLE, DEFAULT_SAMPLE_SIZE)
    return jsonify(process_tags_for_coverage(top_tag_counts))


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

    top_tag_counts = top_tags_in_set(solr_query, CLIFF_ORGS, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(top_tag_counts)

@app.route('/api/explorer/entities/<type_entity>/entities.csv', methods=['GET'])
@flask_login.login_required
def explorer_entities_csv(type_entity):
    tag_type = CLIFF_PEOPLE if type_entity == 'people' else CLIFF_ORGS
    solr_query = parse_query_with_keywords(request.args)
    top_tag_counts = top_tags_in_set(solr_query, tag_type, DEFAULT_SAMPLE_SIZE)
    top_tag_counts = process_tags_for_coverage(solr_query, top_tag_counts)['results']
    for tag in top_tag_counts:
        tag['sample_size'] = DEFAULT_SAMPLE_SIZE
    return csv.stream_response(top_tag_counts, ENTITY_DOWNLOAD_COLUMNS,
                               'explorer-entities-{}'.format(type_entity))
