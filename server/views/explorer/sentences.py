# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.views.explorer import solr_query_from_request, SAMPLE_SEARCHES, parse_query_with_args_and_sample_search, parse_query_with_keywords 
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
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    index = int(request.args['index']) if 'index' in request.args else None

    two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
    start_date = two_weeks_before_now.strftime("%Y-%m-%d")
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    if search_id not in [None, -1]:
        current_search = SAMPLE_SEARCHES[search_id]['data']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
        if index < len(current_search): 
            start_date = current_search[index]['start_date']
            end_date = current_search[index]['end_date']
    else:
        solr_query = parse_query_with_keywords(request.args)
        # TODO what about other params: date etc for demo..

    

    sentence_count_result = mc.sentenceCount(solr_query=solr_query, split_start_date=start_date, split_end_date=end_date, split=True)
    return jsonify(sentence_count_result)

@app.route('/api/explorer/demo/sentences/count/csv', methods=['GET'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_sentences_count_csv():
    user_mc = user_admin_mediacloud_client()

    solr_query = solr_query_from_request(request.form) 
    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.form['start_date'], split_end_date=request.form['end_date'], split=True)
    return jsonify(sentence_count_result)
