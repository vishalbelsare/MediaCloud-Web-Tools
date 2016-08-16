import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.util.request import arguments_required

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/focus-definitions/create', methods=['POST'])
@arguments_required('name', 'description', 'query', 'focalSetDefinitionsId')
@flask_login.login_required
def topic_focus_definition_create(topics_id):
    name = request.form['name']
    description = request.form['description']
    query = request.form['query']
    focal_set_definitions_id = request.form['focalSetDefinitionsId']
    new_focal_set = mc.topicFocusDefinitionCreate(topics_id,
        name=name, description=description, query=query, focal_set_definitions_id=focal_set_definitions_id)
    return jsonify(new_focal_set)
