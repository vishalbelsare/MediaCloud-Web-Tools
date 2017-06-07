import logging
from flask import jsonify, request, redirect
import flask_login

from server import app, auth, mc
from server.auth import user_admin_mediacloud_client
from server.util.request import api_error_handler, form_fields_required, arguments_required, json_error_response

logger = logging.getLogger(__name__)

ACTIVATION_URL = "https://tools.mediacloud.org/api/user/activate/confirm"
PASSWORD_RESET_URL = "https://tools.mediacloud.org/#/reset-password"


@app.route('/api/login', methods=['POST'])
@form_fields_required('email', 'password')
@api_error_handler 
def login_with_password():
    username = request.form["email"]
    logger.debug("login request from %s", username)
    password = request.form["password"]
    # try to log them in
    results = mc.authLogin(username, password)
    if 'error' in results:
        return json_error_response(results['error'], 401)
    user = auth.create_and_cache_user(results['profile'])
    logger.debug("  succeeded - got a key (user.is_anonymous=%s)", user.is_anonymous)
    auth.login_user(user)
    return jsonify(user.get_properties())


@app.route('/api/login-with-cookie')
@api_error_handler
def login_with_cookie():
    user = flask_login.current_user
    if user.is_anonymous:   # no user session
        logger.debug("  login failed (%s)", user.is_anonymous)
        return json_error_response("Login failed", 401)
    return jsonify(user.get_properties())


@app.route('/api/permissions/user/list', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def permissions_for_user():
    user_mc = auth.user_admin_mediacloud_client()
    return user_mc.userPermissionsList()


@app.route('/api/user/signup', methods=['POST'])
@form_fields_required('email', 'password', 'fullName', 'notes', 'subscribeToNewsletter')
@api_error_handler 
def signup():
    logger.debug("reg request from %s", request.form['email'])
    results = mc.authRegister(request.form['email'],
                              request.form['password'],
                              request.form['fullName'],
                              request.form['notes'],
                              request.form['subscribe_to_newsletter'] == '1',
                              ACTIVATION_URL)
    return jsonify(results)


@app.route('/api/user/activation/confirm', methods=['GET'])
@arguments_required('email', 'activation_token')
@api_error_handler
def activation_confirm():
    logger.debug("activation request from %s", request.args['email'])
    results = mc.activate(request.args['email'],
                          request.args['activation_token'])
    if results['success'] is 1:
        # TODO: do we have enough profile info to log them in here?
        redirect('https://tools.mediacloud.org/#/activate?success=1')
    else:
        redirect('https://tools.mediacloud.org/#/activate?success=0&msg='+results['error'])


@app.route('/api/user/activation/resend', methods=['POST'])
@form_fields_required('email')
@api_error_handler
def activation_resend():
    logger.debug("activation request from %s", request.form['email'])
    results = mc.authResendActivationLink(request.args['email'], ACTIVATION_URL)
    return jsonify(results)


@app.route('/api/user/recover_password', methods=['POST'])
@form_fields_required('email')
@api_error_handler
def recover_password():
    logger.debug("recover password request from %s", request.form['email'])
    results = mc.authSendPasswordResetLink(request.form["email"], PASSWORD_RESET_URL)
    return jsonify(results)


@app.route('/api/user/reset_password', methods=['POST'])
@form_fields_required('email', 'password_reset_token', 'password')
@api_error_handler
def reset_password():
    logger.debug("reset password request from %s", request.form['email'])
    results = mc.authResetPassword(request.form["email"], request.form['password_reset_token'], request.form['password'])
    return jsonify(results)


@app.route('/api/user/change_password', methods=['POST'])
@form_fields_required('old_password', 'new_password')
@flask_login.login_required
@api_error_handler
def change_password():
    user_mc = user_admin_mediacloud_client()
    results = user_mc.authChangePassword(request.form['old_password'], request.form['new_password'])
    return jsonify(results)


@app.route('/api/user/reset_api_key', methods=['POST'])
@flask_login.login_required
@api_error_handler
def reset_api_key():
    user_mc = user_admin_mediacloud_client()
    results = user_mc.authResetApiKey()
    return jsonify(results)
