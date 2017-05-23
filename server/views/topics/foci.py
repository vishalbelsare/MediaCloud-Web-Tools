import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import form_fields_required, api_error_handler
from server.auth import user_admin_mediacloud_client

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/focus-definitions/create', methods=['POST'])
@form_fields_required('focusName', 'focusDescription', 'keywords', 'focalSetDefinitionsId')
@flask_login.login_required
@api_error_handler
def topic_focus_definition_create(topics_id):
    user_mc = user_admin_mediacloud_client()
    name = request.form['focusName']
    description = request.form['focusDescription']
    query = request.form['keywords']
    focal_set_definitions_id = request.form['focalSetDefinitionsId']
    new_focal_set = user_mc.topicFocusDefinitionCreate(topics_id,
        name=name, description=description, query=query, focal_set_definitions_id=focal_set_definitions_id)
    return jsonify(new_focal_set)

@app.route('/api/topics/<topics_id>/focus-definitions/<foci_definition_id>/delete', methods=['DELETE'])
@flask_login.login_required
@api_error_handler
def topic_focus_definition_delete(topics_id, foci_definition_id):
    user_mc = user_admin_mediacloud_client()
    results = user_mc.topicFocusDefinitionDelete(topics_id, foci_definition_id)
    return jsonify(results)
