# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, mc
from server.auth import user_admin_mediacloud_client
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.views.explorer import solr_query_from_request, read_sample_searches
# load the shared settings file

logger = logging.getLogger(__name__)

### MAY NOT BE A FORM TODO

@app.route('/api/explorer/sample-searches', methods=['GET'])
@api_error_handler
def api_explorer_sample_searches():
    return read_sample_searches()


@app.route('/api/explorer/demo/sources/list', methods=['GET'])
@arguments_required('sources[]')
@api_error_handler
def api_explorer_sources_by_ids():
    source_list = []
    source_id_array = request.args['sources[]'].split(',')
    for mediaId in source_id_array:
        info = mc.media(mediaId)
        info['id'] = mediaId
        source_list.append(info)
    return jsonify(source_list)

@app.route('/api/explorer/demo/collections/list', methods=['GET'])
@arguments_required('collections[]')
@api_error_handler
def api_explorer_collections_by_ids():
    collIdArray = request.args['collections[]'].split(',')
    coll_list = []
    for tagsId in collIdArray:
        info = mc.tag(tagsId)
        info['id'] = tagsId
        # info['tag_set'] = _tag_set_info(mc, info['tag_sets_id'])
        coll_list.append(info);
    return jsonify(coll_list)


@app.route('/api/explorer/words/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_word_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = solr_query_from_request(request.form)    
    word_count_result = user_mc.wordCount(solr_query=solr_query)

    return jsonify(word_count_result)  # give them back new data, so they can update the client


@app.route('/api/explorer/themes', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_themes():
    return jsonify()

