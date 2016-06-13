import logging
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, auth

logger = logging.getLogger(__name__)

@app.route('/api/login', methods=['POST'])
def api_login_with_password():
    if 'email' not in request.form or 'password' not in request.form:
        return json_error_response(400,"invalid options")
    username = request.form["email"]
    logger.debug("login request from %s" % username)
    password = request.form["password"]
    user = auth.authenticate_by_password(username,password)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)" % user.is_anonymous)
        return json_error_response(401,"login failed")
    auth.login_user(user)
    response = {'email':username,'key': user.get_id()}
    return jsonify(response)

@app.route('/api/login-with-key', methods=['POST'])
def api_login_with_key():
    if 'email' not in request.form or 'key' not in request.form:
        return json_error_response(400,"invalid options")
    username = request.form["email"]
    logger.debug("login request from %s" % username)
    key = request.form["key"]
    user = auth.authenticate_by_key(username,key)
    if user.is_anonymous:   # login failed
        logger.debug("  login failed (%s)" % user.is_anonymous)
        return json_error_response(401,"login failed")
    auth.login_user(user)
    response = {'email':username,'key': user.get_id()}
    return jsonify(response)

def json_error_response(status_code, message):
    response = jsonify({
        'status': status_code,
        'message': message,
    })
    response.status_code = status_code
    return response
