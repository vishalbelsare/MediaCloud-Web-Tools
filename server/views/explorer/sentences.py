# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
from server.views.explorer import concatenate_query_for_solr 

# load the shared settings file

logger = logging.getLogger(__name__)

### MAY NOT BE A FORM TODO

@app.route('/api/explorer/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_sentences_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = solr_query_from_request(request.form) 
    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.form['start_date'], split_end_date=request.form['end_date'], split=True)
    # make sure we return the query and the id passed in..
    return jsonify(sentence_count_result)

@app.route('/api/explorer/demo/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_demo_sentences_count():
    user_mc = user_mediacloud_client()

    solr_query = solr_query_from_request(request.form) 
    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.form['start_date'], split_end_date=request.form['end_date'], split=True)
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
