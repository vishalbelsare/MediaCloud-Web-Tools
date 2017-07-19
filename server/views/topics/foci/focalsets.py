import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import arguments_required, form_fields_required, api_error_handler
from server.auth import user_admin_mediacloud_client, user_mediacloud_key
from server.views.topics.apicache import topic_focal_sets

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/focal-sets/list', methods=['GET'])
@arguments_required('snapshotId')
@flask_login.login_required
@api_error_handler
def topic_focal_set_list(topics_id):
    snapshots_id = request.args.get('snapshotId')
    focal_sets = topic_focal_sets(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id)
    return jsonify(focal_sets)


@app.route('/api/topics/<topics_id>/focal-set-definitions/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_focal_set_definitions_list(topics_id):
    user_mc = user_admin_mediacloud_client()
    definitions = user_mc.topicFocalSetDefinitionList(topics_id)
    return jsonify(definitions)


@app.route('/api/topics/<topics_id>/focal-set-definitions/create', methods=['POST'])
@form_fields_required('focalSetName', 'focalSetDescription', 'focalTechnique')
@flask_login.login_required
@api_error_handler
def topic_focal_set_definitions_create(topics_id):
    user_mc = user_admin_mediacloud_client()
    name = request.form['focalSetName']
    description = request.form['focalSetDescription']
    focal_technique = request.form['focalTechnique']
    new_focal_set = user_mc.topicFocalSetDefinitionCreate(topics_id, name, description, focal_technique)
    return jsonify(new_focal_set)


@app.route('/api/topics/<topics_id>/focal-set-definitions/<focal_set_definitions_id>/delete', methods=['DELETE'])
@flask_login.login_required
@api_error_handler
def topic_focal_set_definition_delete(topics_id, focal_set_definitions_id):
    user_mc = user_admin_mediacloud_client()
    results = user_mc.topicFocalSetDefinitionDelete(topics_id, focal_set_definitions_id)
    return jsonify(results)
