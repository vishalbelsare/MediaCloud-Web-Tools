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
    object_id = db.save_notebook_clipping(auth.user_name(), content)
    return jsonify({'id': str(object_id)})


@app.route('/api/notebook/clippings')
#@flask_login.login_required
@api_error_handler
def notebook_clippings():
    username = 'rahulb@media.mit.edu'  # auth.user_name()
    app = request.args['app'] if 'app' in request.args else None
    clippings = db.list_notebook_clippings(username, app)
    clippings = [c for c in clippings]
    for c in clippings:
        c['id'] = str(c['_id'])    # need to convert ObjectId to something that can be jsonified
        del c['_id']
    return jsonify({'list': clippings})


@app.route('/api/notebook/<clipping_id>', methods=['GET'])
@api_error_handler
def notebook_clipping(clipping_id):
    clipping = db.load_notebook_clipping(clipping_id)
    return jsonify(clipping)
