import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.views.util.request import validate_params_exist, json_error_response

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/focal-sets/list', methods=['GET'])
#@flask_login.login_required
def topic_focal_set_list(topics_id):
    try:
        validate_params_exist(request.args, ['snapshotId'])
    except Exception as e:
        logger.exception("Missing a required arg")
        return json_error_response(e.args[0])
    snapshots_id = request.args.get('snapshotId')
    focal_sets = mc.topicFocalSetList(topics_id, snapshots_id=snapshots_id)
    return jsonify(focal_sets)

@app.route('/api/topics/<topics_id>/focal-set-definitions/list', methods=['GET'])
@flask_login.login_required
def topic_focal_set_definitions_list(topics_id):
    return jsonify(mc.topicFocalSetDefinitionList(topics_id))

@app.route('/api/topics/<topics_id>/focal-set-definitions/create', methods=['POST'])
@flask_login.login_required
def topic_focal_set_definitions_create(topics_id):
    try:
        validate_params_exist(request.form, ['name', 'description', 'focalTechnique'])
    except Exception as e:
        logger.exception("Missing a required param")
        return json_error_response(e.args[0])
    name = request.form['name']
    description = request.form['description']
    focal_technique = request.form['focalTechnique']
    new_focal_set = mc.topicFocalSetDefinitionCreate(topics_id, name, description, focal_technique)
    return jsonify(new_focal_set)

@app.route('/api/topics/<topics_id>/focal-set-definitions/<focal_set_definitions_id>/delete', methods=['DELETE'])
@flask_login.login_required
def topic_focal_set_definition_delete(topics_id, focal_set_definitions_id):
    results = mc.topicFocalSetDefinitionDelete(topics_id, focal_set_definitions_id)
    return jsonify(results)
