# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
from server.util.common import _media_ids_from_sources_param, _media_tag_ids_from_collections_param
from server.views.explorer import solr_query_from_request 

# load the shared settings file

logger = logging.getLogger(__name__)

### MAY NOT BE A FORM TODO

@app.route('/api/explorer/sample-searches', methods=['GET'])
@api_error_handler
def api_explorer_sample_searches():
    example_search = []
    example_search.append({ 'id': 0, 'label': 'public health query', 'description': 'lorem epsum', 'q': 'public', 'start_date': '2016-02-02', 'end_date': '2017-02-02', 'imagePath': '.', 'color': 'green' })
    example_search.append({ 'id': 1, 'label': 'chocolate query', 'description': 'lorem epsum', 'q': 'chocolate and dessert', 'start_date': '2016-02-02', 'end_date': '2017-02-02', 'imagePath': '.', 'color': 'blue' })
    example_search.append({ 'id': 2, 'label': 'bike safety query', 'description': 'lorem epsum', 'q': 'bike or safety', 'start_date': '2016-02-02', 'end_date': '2017-02-02', 'imagePath': '.', 'color': 'red' })
    
    example_search2 = []
    example_search2.append({ 'id': 3, 'label': 'search2 news query', 'description': 'lorem epsum', 'q': 'news', 'start_date': '2016-05-05', 'end_date': '2017-05-05', 'imagePath': '.', 'color': 'green' })
    example_search2.append({ 'id': 1, 'label': 'search2 candy query', 'description': 'lorem epsum', 'q': 'candy and dessert', 'start_date': '2016-05-05', 'end_date': '2017-02-02', 'imagePath': '.', 'color': 'blue' })
    example_search2.append({ 'id': 2, 'label': 'search2 motorcycle safety query', 'description': 'lorem epsum', 'q': 'motorcycle or safety', 'start_date': '2016-05-05', 'end_date': '2017-02-02', 'imagePath': '.', 'color': 'red' })

    example_searches = [{'label':'example1', 'id':0, 'data': example_search} , {'label':'example2', 'id':1, 'data': example_search2 }]

    return jsonify({'list': example_searches})

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

