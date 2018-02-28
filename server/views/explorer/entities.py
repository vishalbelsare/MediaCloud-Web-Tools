import json
import logging

import flask_login
from flask import jsonify, request

import server.util.csv as csv
from server import app
from server.util.request import api_error_handler
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS
from server.views.explorer import parse_as_sample, parse_query_with_args_and_sample_search, parse_query_with_keywords, \
    load_sample_searches
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)

DEFAULT_FIELD_COUNT_SAMPLE_SIZE = 1000  # how many sentences to sample for tags
DEFAULT_DISPLAY_AMOUNT = 10

ENTITY_DOWNLOAD_COLUMNS = ['label', 'count', 'pct', 'sample_size','tags_id']


@app.route('/api/explorer/entities/people', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_entities_people():
    results = top_tags_with_coverage(CLIFF_PEOPLE)
    return jsonify(results)


@app.route('/api/explorer/entities/organizations', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_entities_organizations():
    results = top_tags_with_coverage(CLIFF_ORGS)
    return jsonify(results)


@app.route('/api/explorer/demo/entities/people', methods=['GET'])
@api_error_handler
def api_explorer_demo_top_entities_people():
    results = demo_top_tags_with_coverage(CLIFF_PEOPLE)
    return jsonify(results)


@app.route('/api/explorer/demo/entities/organizations', methods=['GET'])
@api_error_handler
def api_explorer_demo_top_entities_organizations():
    results = demo_top_tags_with_coverage(CLIFF_ORGS)
    return jsonify(results)


def top_tags_with_coverage(tag_sets_id, limit=DEFAULT_DISPLAY_AMOUNT):
    # parses the query for you
    q = parse_query_with_keywords(request.args)
    return apicache.top_tags_with_coverage(q, tag_sets_id, limit, DEFAULT_FIELD_COUNT_SAMPLE_SIZE)


def demo_top_tags_with_coverage(tag_sets_id, limit=DEFAULT_DISPLAY_AMOUNT):
    # parses the query for you
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        current_search = sample_searches[search_id]['queries']
        q = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        q = parse_query_with_keywords(request.args)
    return apicache.top_tags_with_coverage(q, tag_sets_id, limit, DEFAULT_FIELD_COUNT_SAMPLE_SIZE)


@app.route('/api/explorer/entities/<type_entity>/entities.csv/<search_id_or_query>/<index>', methods=['GET'])
@api_error_handler
def explorer_entities_csv(type_entity, search_id_or_query, index):
    sample_size = DEFAULT_FIELD_COUNT_SAMPLE_SIZE
    tag_sets_id = CLIFF_PEOPLE if type_entity == 'people' else CLIFF_ORGS
    fn = 'explorer-entities-{}'.format(type_entity)

    try:
        search_id = int(search_id_or_query)
        if search_id >= 0: # this is a sample query
            solr_query = parse_as_sample(search_id, index)
            # TODO 
            filename = fn  #+ current_query['q']
    except ValueError:
        # planned exception if search_id is actually a keyword or query
        # csv downloads are 1:1 - one query to one download, so we can use index of 0
        query_or_keyword = search_id_or_query
        current_query = json.loads(query_or_keyword)[0]
        filename = fn + current_query['q']
        solr_query = parse_query_with_keywords(current_query)

    top_tag_counts = apicache.top_tags_with_coverage(solr_query, tag_sets_id, None, sample_size)['results']
    for tag in top_tag_counts:
        tag['sample_size'] = sample_size
    return csv.stream_response(top_tag_counts, ENTITY_DOWNLOAD_COLUMNS, filename.format(type_entity))
