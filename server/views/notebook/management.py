import logging
from flask import jsonify, request
import flask_login
import json

from server import app, db, auth
from server.util.request import api_error_handler
from server.util.request import form_fields_required

logger = logging.getLogger(__name__)


@app.route('/api/notebook/save', methods=['POST'])
@form_fields_required('content')
@flask_login.login_required
@api_error_handler
def notebook_add():
    content = json.loads(request.form['content'])
    object_id = db.save_notebook_entry(auth.user_name(), content)
    return jsonify({'id': str(object_id)})


@app.route('/api/notebook/<entry_id>', methods=['GET'])
@api_error_handler
def notebook_view(entry_id):
    object = db.load_notebook_entry(entry_id)
    return jsonify(object)
