# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache
from server.auth import is_user_logged_in, user_mediacloud_key
from server.util.request import api_error_handler
import server.util.csv as csv
from server.views.explorer import parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches

# load the shared settings file
DEFAULT_NUM_WORDS = 100
DEFAULT_SAMPLE_SIZE = 5000

logger = logging.getLogger(__name__)


@app.route('/api/explorer/words/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_words():
    return get_word_count()


@app.route('/api/explorer/demo/words/count', methods=['GET'])
@api_error_handler
def api_explorer_demo_words():
    return get_word_count()


def get_word_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        current_search = sample_searches[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
        word_count_result = query_wordcount(solr_query)
    else:
        solr_query = parse_query_with_keywords(request.args)
        word_count_result = query_wordcount(solr_query)
    return jsonify({"list": word_count_result})


@app.route('/api/explorer/words/wordcount.csv', methods=['GET'])
@api_error_handler
def explorer_wordcount_csv():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None

    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        current_search = sample_searches[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)

    return stream_wordcount_csv(user_mediacloud_key(), 'wordcounts-Explorer', solr_query)


@app.route('/api/explorer/words/compare/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_compare_words():
    user_mc = user_admin_mediacloud_client()
    compared_queries = request.args['compared_queries[]'].split(',')
    results = []
    for cq in compared_queries:
        dictq = {x[0]: x[1] for x in [x.split("=") for x in cq[1:].split("&")]}
        solr_query = parse_query_with_keywords(dictq)
        word_count_result = query_wordcount(solr_query)
        results.append(word_count_result)
    return jsonify({"list": results})  


@app.route('/api/explorer/demo/words/compare/count')
@api_error_handler
def api_explorer_demo_compare_words():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        compared_sample_queries = sample_searches[search_id]['queries']
        results = []
        for cq in compared_sample_queries:
            solr_query = parse_query_with_keywords(cq)
            word_count_result = query_wordcount(solr_query)
            results.append(word_count_result)
    else:
        compared_queries = request.args['compared_queries[]'].split(',')
        results = []
        for cq in compared_queries:
            dictq = {x[0]:x[1] for x in [x.split("=") for x in cq[1:].split("&")]}
            solr_query = parse_query_with_keywords(dictq)
            word_count_result = query_wordcount(solr_query)
            results.append(word_count_result)

    return jsonify({"list": results})


def query_wordcount(query, num_words=DEFAULT_NUM_WORDS, sample_size=DEFAULT_SAMPLE_SIZE):
    if is_user_logged_in():   # no user session
        user_mc_key = user_mediacloud_key()
    else:
        user_mc_key = None
    return _cached_word_count(user_mc_key, query, num_words, sample_size)


@cache
def _cached_word_count(user_mc_key, query, num_words, sample_size):
    if is_user_logged_in():   # no user session
        api_client = user_mediacloud_client()
    else:
        api_client = mc
    results = api_client.wordCount('*', query, num_words=num_words, sample_size=sample_size)
    return results


def stream_wordcount_csv(mc_key, filename, query):
    response = query_wordcount(mc_key, query, 500, 10000)
    props = ['count', 'term', 'stem']
    return csv.stream_response(response, props, filename)
