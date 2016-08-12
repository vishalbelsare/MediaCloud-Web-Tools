import logging
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, auth
from server.views.util.request import validate_params_exist, json_error_response

logger = logging.getLogger(__name__)

@app.route('/api/login', methods=['POST'])
def login_with_password():
    try:
        validate_params_exist(request.form, ['email', 'password'])
    except Exception as e:
        logger.exception("Missing a required param")
        return json_error_response(e.args[0])
    username = request.form["email"]
    logger.debug("login request from %s", username)
    password = request.form["password"]
    user = auth.authenticate_by_password(username, password)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("login failed", 401)
    auth.login_user(user)
    response = {'email':username, 'key':user.get_id()}
    return jsonify(response)

@app.route('/api/login-with-key', methods=['POST'])
def login_with_key():
    try:
        validate_params_exist(request.form, ['email', 'key'])
    except Exception as e:
        logger.exception("Missing a required param")
        return json_error_response(e.args[0])
    username = request.form["email"]
    logger.debug("login request from %s", username)
    key = request.form["key"]
    user = auth.authenticate_by_key(username, key)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("login failed", 401)
    auth.login_user(user)
    response = {'email':username, 'key':user.get_id()}
    return jsonify(response)
