# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from operator import itemgetter
from server import app, mc
from server.auth import user_admin_mediacloud_client
from server.cache import cache
from server.util.request import api_error_handler
import server.util.csv as csv
from server.views.explorer import solr_query_from_request, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
import json
# load the shared settings file
DEFAULT_NUM_WORDS = 100
DEFAULT_SAMPLE_SIZE = 5000


logger = logging.getLogger(__name__)


@app.route('/api/explorer/words/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_words():
    user_mc = user_admin_mediacloud_client()
    comparedQueries = request.args['comparedQueries[]'].split(',')
    results = []
    for cQ in comparedQueries:
        dictQ = {x[0] : x[1] for x in [x.split("=") for x in cQ[1:].split("&") ]}
        solr_query = parse_query_with_keywords(dictQ)
        story_count_result = cached_wordcount(user_mc, solr_query)
        results.append(story_count_result)
    return jsonify({"results": results})  


@app.route('/api/explorer/demo/words/count')
@api_error_handler
def api_explorer_demo_words():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)

    story_count_result = cached_wordcount(mc, solr_query)
    return jsonify(story_count_result)     

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


    return stream_wordcount_csv(mc, 'wordcounts-Explorer', solr_query)

def cached_wordcount(user_mc_key, query, num_words=DEFAULT_NUM_WORDS, sample_size=DEFAULT_SAMPLE_SIZE):
    api_client = mc if user_mc_key is None else user_admin_mediacloud_client()
    res = api_client.wordCount('*', query, num_words=num_words, sample_size=sample_size)
    return res



def stream_wordcount_csv(mc_key, filename, query):
    response = cached_wordcount(mc_key, query, 500, 10000)
    props = ['count', 'term', 'stem']
    return csv.stream_response(response, props, filename)


