# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.views.explorer import SAMPLE_SEARCHES, concatenate_query_for_solr, parse_query_with_args_and_sample_search
import datetime
# load the shared settings file

logger = logging.getLogger(__name__)

@app.route('/api/explorer/demo/stories/sample', methods=['GET'])
@api_error_handler
def api_explorer_demo_story_sample():
    current_search = SAMPLE_SEARCHES[int(request.args['search_id'])]['data']
    solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    
    # TODO remove any dates or extra info from q. UI should prevent also   
    story_count_result = mc.storyList(solr_query=solr_query)
    return jsonify(story_count_result)  


@app.route('/api/explorer/demo/story/count', methods=['GET'])
@api_error_handler
def api_explorer_demo_story_count():
    current_search = SAMPLE_SEARCHES[int(request.args['search_id'])]['data']

    solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    
    story_count_result = mc.storyCount(solr_query=solr_query)
    # maybe check admin role before we run this?
    return jsonify(story_count_result)  # give them back new data, so they can update the client
