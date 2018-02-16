import logging
from flask import jsonify, request
import flask_login
import json

from server import app, mc
from server.cache import cache, key_generator
from server.auth import is_user_logged_in, user_mediacloud_key, user_mediacloud_client
from server.util.request import api_error_handler
import server.util.wordembeddings as wordembeddings
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
    else:
        solr_query = parse_query_with_keywords(request.args)
    word_data = query_wordcount(solr_query)
    # add in word2vec results
    words = [w['term'] for w in word_data]
    # and now add in word2vec model position data
    google_word2vec_data = _cached_word2vec_google_2d(words)
    for i in range(len(google_word2vec_data)):
        word_data[i]['google_w2v_x'] = google_word2vec_data[i]['x']
        word_data[i]['google_w2v_y'] = google_word2vec_data[i]['y']
    # return combined data
    return jsonify({"list": word_data})


@app.route('/api/explorer/words/wordcount.csv/<search_id_or_query>/<index>', methods=['GET'])
@api_error_handler
def explorer_wordcount_csv(search_id_or_query, index):
    ngram_size = request.args['ngram_size'] if 'ngram_size' in request.args else 1
    try:
        search_id = int(search_id_or_query) # ie. the search_id_or_query is sample search id
        if search_id >= 0:
            sample_searches = load_sample_searches()
            current_search = sample_searches[search_id]['queries']
            solr_query = parse_query_with_args_and_sample_search(search_id, current_search)
    except ValueError:  # ie. the search_id_or_query is a query
        # so far, we will only be fielding one keyword csv query at a time, so we can use index of 0
        query = json.loads(search_id_or_query)
        current_query = query[0]
        solr_query = parse_query_with_keywords(current_query)
    return stream_wordcount_csv('Explorer-wordcounts-ngrams-{}'.format(ngram_size), solr_query, ngram_size)


@app.route('/api/explorer/words/compare/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_compare_words():
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


def query_wordcount(query, ngram_size=1, num_words=DEFAULT_NUM_WORDS, sample_size=DEFAULT_SAMPLE_SIZE):
    if is_user_logged_in():   # no user session
        user_mc_key = user_mediacloud_key()
    else:
        user_mc_key = None
    return _cached_word_count(user_mc_key, query, ngram_size, num_words, sample_size)


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_word_count(user_mc_key, query, ngram_size, num_words, sample_size):
    if is_user_logged_in():   # no user session
        api_client = user_mediacloud_client()
    else:
        api_client = mc
    results = api_client.wordCount('*', query, ngram_size=ngram_size, num_words=num_words, sample_size=sample_size)
    return results


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_word2vec_google_2d(words):
    word2vec_results = wordembeddings.google_news_2d(words)
    return word2vec_results


def stream_wordcount_csv(filename, query, ngram_size=1):
    # use bigger values for CSV download
    num_words = 500
    sample_size = 10000
    word_counts = query_wordcount(query, ngram_size, num_words, sample_size)
    for w in word_counts:
        w['sample_size'] = sample_size
        w['ratio'] = float(w['count'])/float(sample_size)
    props = ['term', 'stem', 'count', 'sample_size', 'ratio']
    return csv.stream_response(word_counts, props, filename)
