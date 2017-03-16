import logging
from flask import jsonify, request, render_template
import flask_login

from server import app, auth
from server.util.request import api_error_handler
from server.util.mail import send_html_email
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
