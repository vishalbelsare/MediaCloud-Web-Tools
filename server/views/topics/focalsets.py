import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache
from server.views.util.request import validate_params_exist, json_error_response

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/focal-sets', methods=['GET'])
@flask_login.login_required
def topic_focal_set_list(topics_id):
    snapshots_id = request.args.get('snapshotId')
    focal_sets = mc.topicFocalSetList(topics_id, snapshots_id=snapshots_id)
    return jsonify(focal_sets)

@app.route('/api/topics/<topics_id>/focal-set-definitions/create', methods=['POST'])
#@flask_login.login_required
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

@app.route('/api/topics/<topics_id>/focal-set-definitions', methods=['GET'])
#@flask_login.login_required
def topic_focal_set_definitions_list(topics_id):
    return jsonify(mc.topicFocalSetDefinitionList(topics_id))
