# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
import server.util.csv as csv
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3, HIGHCHARTS_KEYS
import server.util.tags as tag_utl
from server.views.explorer import concatenate_query_for_solr, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
# load the shared settings file
DEFAULT_NUM_WORDS = 100
DEFAULT_SAMPLE_SIZE = 5000


logger = logging.getLogger(__name__)

@app.route('/api/explorer/words')
@api_error_handler
def explorer_words():
     search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)
        # TODO what about other params: date etc for demo..
    return stream_wordcount_csv(mc, 'wordcounts-Explorer', solr_query)

@app.route('/api/explorer/words/wordcount.csv', methods=['GET'])
@api_error_handler
def explorer_wordcount_csv():
    
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)
        # TODO what about other params: date etc for demo..

    return stream_wordcount_csv(mc, 'wordcounts-Explorer', solr_query)

@cache
def cached_wordcount(user_mc_key, query, num_words=DEFAULT_NUM_WORDS, sample_size=DEFAULT_SAMPLE_SIZE):
    api_client = mc if user_mc_key is None else user_admin_mediacloud_client()
    res = api_client.wordCount('*', query, num_words=num_words, sample_size=sample_size)
    return res



def stream_wordcount_csv(mc_key, filename, query):
    response = cached_wordcount(mc_key, query, 500, 10000)
    props = ['count', 'term', 'stem']
    return csv.stream_response(response, props, filename)


