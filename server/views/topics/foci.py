import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.views.util.request import validate_params_exist, json_error_response

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/focus-definitions/<focal_set_definitions_id>', methods=['GET'])
@flask_login.login_required
def topic_focus_definitions_list(topics_id, focal_set_definitions_id):
    return jsonify(mc.topicFocusDefinitionList(topics_id, focal_set_definitions_id))

@app.route('/api/topics/<topics_id>/focus-definitions/create', methods=['POST'])
@flask_login.login_required
def topic_focus_definition_create(topics_id):
    try:
        validate_params_exist(request.form, ['name', 'description', 'query', 'focal_set_definitions_id'])
    except Exception as e:
        logger.exception("Missing a required param")
        return json_error_response(e.args[0])
    name = request.form['name']
    description = request.form['description']
    query = request.form['query']
    focal_set_definitions_id = request.form['focal_set_definitions_id']
    new_focal_set = mc.topicFocusDefinitionCreate(topics_id,
        name=name, description=description, query=query, focal_set_definitions_id=focal_set_definitions_id)
    return jsonify(new_focal_set)
