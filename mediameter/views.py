import logging
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from mediameter import app
import auth

logger = logging.getLogger(__name__)

@app.route('/')
def index():
    logger.debug("homepage request")
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def api_login_with_password():
    if 'email' not in request.form or 'password' not in request.form:
        return abort(400)
    username = request.form["email"]
    logger.debug("login request from %s" % username)
    password = request.form["password"]
    user = auth.authenticate_by_password(username,password)
    if user.is_anonymous():   # login failed
        logger.debug("  login failed")
        return abort(401)
    logger.debug("  login succeeded")
    flask_login.login_user(user)
    user.create_in_db_if_needed()
    response = {'email':username,'key': user.get_id()}
    return jsonify(response)

@app.route('/api/login-with-key', methods=['POST'])
def api_login_with_key():
    if 'email' not in request.form or 'key' not in request.form:
        return abort(400)
    username = request.form["email"]
    logger.debug("login request from %s" % username)
    key = request.form["key"]
    user = auth.authenticate_by_key(username,key)
    if user.is_anonymous():   # login failed
        logger.debug("  login failed")
        return abort(401)
    logger.debug("  login succeeded")
    flask_login.login_user(user)
    user.create_in_db_if_needed()
    response = {'email':username,'key': user.get_id()}
    return jsonify(response)