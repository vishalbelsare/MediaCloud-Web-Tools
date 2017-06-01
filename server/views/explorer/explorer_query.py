# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
from server.util.common import _media_ids_from_sources_param, _media_tag_ids_from_collections_param
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
    return jsonify(sentence_count_result)

@app.route('/api/explorer/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_story_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = solr_query_from_request(request.form)  
    story_count_result = user_mc.storyCount(solr_query=solr_query)
    # maybe check admin role before we run this?
    return jsonify(story_count_result)  # give them back new data, so they can update the client

@app.route('/api/explorer/stories/sample', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_story_sample():
    user_mc = user_mediacloud_client()

    solr_query = solr_query_from_request(request.form)     
    story_count_result = user_mc.storyList(solr_query=solr_query)
    return jsonify(story_count_result)  


@app.route('/api/explorer/words/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_word_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = solr_query_from_request(request.form)    
    word_count_result = user_mc.wordCount(solr_query=solr_query)

    return jsonify(word_count_result)  # give them back new data, so they can update the client

@app.route('/api/explorer/geo_tags', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_geo_tags():
    return jsonify()


@app.route('/api/explorer/themes', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_themes():
    return jsonify()

