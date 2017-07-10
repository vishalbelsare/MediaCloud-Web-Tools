# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from operator import itemgetter
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.cache import cache
from server.util.request import form_fields_required, api_error_handler, arguments_required
import server.util.csv as csv
from server.views.explorer import solr_query_from_request, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
# load the shared settings file

logger = logging.getLogger(__name__)

### MAY NOT BE A FORM TODO

@app.route('/api/explorer/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_sentences_count():
    user_mc = user_admin_mediacloud_client()
    # is id an option here?
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

    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
        if index < len(current_search): 
            start_date = current_search[index]['startDate']
            end_date = current_search[index]['endDate']
    else:
        solr_query = parse_query_with_keywords(request.args)
        start_date = start_date_str
        end_date = end_date_str

    # TODO not sure if we need this
    if start_date_str is None:
        last_n_days = 365
        start_date = datetime.date.today()-datetime.timedelta(last_n_days)
        start_date = start_date.strftime("%Y-%m-%d")
    if end_date_str is None:
        end_date = datetime.date.today()-datetime.timedelta(1)  # yesterday 
        end_date = end_date.strftime("%Y-%m-%d")

    return cached_by_query_sentence_counts(solr_query, start_date, end_date)


@cache
def cached_by_query_sentence_counts(query, start_date_str=None, end_date_str=None):
    sentence_count_result = mc.sentenceCount(solr_query=query, split_start_date=start_date_str, split_end_date=end_date_str, split=True)
    return sentence_count_result['response']


def stream_sentence_count_csv(fn, search_id_or_query, index):
    response = {}
    two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
    start_date = two_weeks_before_now.strftime("%Y-%m-%d")
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    SAMPLE_SEARCHES = load_sample_searches()
    if int(search_id_or_query) < len(SAMPLE_SEARCHES):
        search_id = int(search_id_or_query)
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(search_id, current_search)

        if int(index) < len(current_search): 
            start_date = current_search[int(index)]['startDate']
            end_date = current_search[int(index)]['endDate']
    else:
        solr_query = parse_query_with_keywords(search_id_or_query)
        start_date = search_id_or_query['startDate']
        end_date = search_id_or_query['endDate']

    results = cached_by_query_sentence_counts(solr_query, start_date, end_date) # get dates out of query?
    clean_results = [{'date': date, 'numFound': count} for date, count in results['split'].iteritems() if date not in ['gap', 'start', 'end']]
    sorted_results = sorted(clean_results, key=itemgetter('date'))

    clean_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'numFound']
    return csv.stream_response(clean_results, props, fn)

# TODO, how different logged-in v demo user
@app.route('/api/explorer/sentences/count.csv/<search_id_or_query>/<index>')
@api_error_handler
def api_explorer_sentence_count_csv(search_id_or_query, index):
    return stream_sentence_count_csv('sentenceCounts-Explorer', search_id_or_query, index)

