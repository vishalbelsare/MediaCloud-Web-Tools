import logging
from flask import jsonify, request
import flask_login
import json

from server import app, db, auth
from server.util.request import api_error_handler
from server.util.request import form_fields_required, json_error_response

logger = logging.getLogger(__name__)

@app.route('/api/login', methods=['POST'])
@form_fields_required('email', 'password')
@api_error_handler 
def login_with_password():
    username = request.form["email"]
    logger.debug("login request from %s", username)
    password = request.form["password"]
    user = auth.authenticate_by_password(username, password)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("Login failed", 401)
    auth.login_user(user)
    return jsonify(user.get_properties())

@app.route('/api/login-with-key', methods=['POST'])
@form_fields_required('email', 'key')
@api_error_handler 
def login_with_key():
    username = request.form["email"]
    logger.debug("login request from %s", username)
    key = request.form["key"]
    user = auth.authenticate_by_key(username, key)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("Login failed", 401)
    auth.login_user(user)
    return jsonify(user.get_properties())

@app.route('/api/permissions/user/list', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def permissions_for_user():
    user_mc = auth.user_mediacloud_client()
    return user_mc.userPermissionsList()

@app.route('/api/user/notebook/save', methods=['POST'])
@form_fields_required('type', 'data', 'info')
@api_error_handler
def notebook_add():
    entry = {
        'type': request.form['type'],
        'data': json.decode(request.form['data']),
        'info': json.decode(request.form['info'])
    }
    results = db.save_notebook_entry(auth.user_name(), entry)
    return jsonify(results)

@app.route('/api/user/notebook/<entry_id>', methods=['GET'])
@api_error_handler
def notebook_view(entry_id):
    entry = db.load_notebook_entry(entry_id)
    return jsonify(entry)
