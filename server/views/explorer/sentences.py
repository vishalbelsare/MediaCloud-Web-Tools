import logging
from flask import jsonify, request
import flask_login
from operator import itemgetter
from server import app, mc
from server.auth import user_admin_mediacloud_client
from server.cache import cache, key_generator
from server.util.request import api_error_handler
import server.util.csv as csv
from server.views.explorer import parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches, parse_as_sample
import datetime
import json

logger = logging.getLogger(__name__)


@app.route('/api/explorer/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_sentences_count():
    user_mc = user_admin_mediacloud_client()
    # dates are required as is one collection, how do we handle default for logged in users?
    solr_query = parse_query_with_keywords(request.args)
    sentence_count_result = cached_by_query_sentence_counts(solr_query, request.args['start_date'], request.args['end_date'])
    return jsonify(sentence_count_result)


@app.route('/api/explorer/demo/sentences/count', methods=['GET'])
# handles search id query or keyword query
@api_error_handler
def api_explorer_demo_sentences_count():
    two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
    start_date = two_weeks_before_now.strftime("%Y-%m-%d")
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    index = int(request.args['index']) if 'index' in request.args else None

    if isinstance(search_id, int) and search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)

        if index < len(current_search): 
            start_date = current_search[index]['startDate']
            end_date = current_search[index]['endDate']
    else:
        solr_query = parse_query_with_keywords(request.args)
    # why is this call fundamentally different than the cache call???
    results = cached_by_query_sentence_counts(solr_query, start_date, end_date)
    
    return jsonify(results)


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_by_query_sentence_counts(solr_query, start_date_str=None, end_date_str=None):
    sentence_count_result = mc.sentenceCount(solr_query=solr_query,
                                             split_start_date=start_date_str, split_end_date=end_date_str, split=True)
    return sentence_count_result


# if this is a sample search, we will have a search id and a query index
# if this is a custom search, we will have a query will q,start_date, end_date, sources and collections
def stream_sentence_count_csv(fn, search_id_or_query, index):
    solr_query = ''
    try:
        search_id = int(search_id_or_query)
        if search_id >= 0:  # this is a sample query
            solr_query = parse_as_sample(search_id, index)
            # TODO 
            filename = fn  #+ current_query['q']
        two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
        start_date = two_weeks_before_now.strftime("%Y-%m-%d")
        end_date = datetime.datetime.now().strftime("%Y-%m-%d")
    except ValueError:
        # planned exception if search_id is actually a keyword or query
        # csv downloads are 1:1 - one query to one download, so we can use index of 0
        query = search_id_or_query
        current_query = json.loads(query)[0]
        solr_query = parse_query_with_keywords(current_query)
        filename = fn + current_query['label']
        start_date = current_query['startDate']
        end_date = current_query['endDate']

    # sentence count needs dates to be sent explicitly -TODO check what has priority
    results = cached_by_query_sentence_counts(solr_query, start_date, end_date)  # get dates out of query?
    clean_results = [{'date': date, 'sentences': count} for date, count in results['split'].iteritems() if date not in ['gap', 'start', 'end']]
    clean_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'sentences']
    return csv.stream_response(clean_results, props, filename)


@app.route('/api/explorer/sentences/count.csv/<search_id_or_query>/<index>', methods=['GET'])
@api_error_handler
def api_explorer_sentence_count_csv(search_id_or_query, index=None):
    return stream_sentence_count_csv('explorer-sentence-counts-', search_id_or_query, index)

