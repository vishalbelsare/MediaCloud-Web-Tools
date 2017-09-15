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

logger = logging.getLogger(__name__)


@app.route('/api/explorer/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_sentences_count():
    user_mc = user_admin_mediacloud_client()
    # dates are required as is one collection, how do we handle default for logged in users?
    solr_query = solr_query_from_request(request.args) 
    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.args['start_date'], split_end_date=request.args['end_date'], split=True)
    # make sure we return the query and the id passed in..
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
    sentence_count_result = mc.sentenceCount(solr_query=solr_query, split_start_date=start_date, split_end_date=end_date, split=True)
    results = cached_by_query_sentence_counts(solr_query, start_date, end_date)
    
    return jsonify(results)


@cache
def cached_by_query_sentence_counts(solr_query, start_date_str=None, end_date_str=None):
    sentence_count_result = mc.sentenceCount(solr_query=solr_query, split_start_date=start_date_str, split_end_date=end_date_str, split=True)
    return sentence_count_result


def stream_sentence_count_csv(fn, search_id_or_query, index):

    two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
    start_date = two_weeks_before_now.strftime("%Y-%m-%d")
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    SAMPLE_SEARCHES = load_sample_searches() # TODO: some duplicate code here
    try:
        search_id = int(search_id_or_query)
        if search_id >= 0:
            SAMPLE_SEARCHES = load_sample_searches()
            current_search = SAMPLE_SEARCHES[search_id]['queries']
            solr_query = parse_query_with_args_and_sample_search(search_id, current_search)

            if int(index) < len(current_search): 
                start_date = current_search[int(index)]['startDate']
                end_date = current_search[int(index)]['endDate']
                filename = fn + current_search[int(index)]['q']

    except Exception as e:
        # so far, we will only be fielding one keyword csv query at a time, so we can use index of 0
        query = json.loads(search_id_or_query)
        current_query = query[0]
        solr_query = parse_query_with_keywords(current_query) # TODO don't mod the start and end date unless permissions
        filename = fn + current_query['q']

    results = cached_by_query_sentence_counts(solr_query, start_date, end_date) # get dates out of query?
    clean_results = [{'date': date, 'sentences': count} for date, count in results['split'].iteritems() if date not in ['gap', 'start', 'end']]
    clean_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'sentences']
    return csv.stream_response(clean_results, props, filename)


@app.route('/api/explorer/sentences/count.csv/<search_id_or_query>/<index>', methods=['GET'])
@api_error_handler
def api_explorer_sentence_count_csv(search_id_or_query, index):
    return stream_sentence_count_csv('explorer-sentence-counts-', search_id_or_query, index)

