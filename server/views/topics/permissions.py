# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from mediacloud.error import MCException

from server import app
from server.util.request import form_fields_required, json_error_response, api_error_handler
from server.auth import user_mediacloud_client

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/permissions/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_permissions_list(topics_id):
    user_mc = user_mediacloud_client()
    results = user_mc.topicPermissionsList(topics_id)
    return jsonify(results)

@app.route('/api/topics/<topics_id>/permissions/update', methods=['PUT'])
@form_fields_required('email', 'permission')
@flask_login.login_required
@api_error_handler
def topic_update_permission(topics_id):
    email = request.form["email"]
    permission = request.form["permission"]
    if permission not in ['read', 'write', 'admin', 'none']:
        return json_error_response('Invalid permission value')
    user_mc = user_mediacloud_client()
    try:
        results = user_mc.topicPermissionsUpdate(topics_id, email, permission)
    except MCException as e:
        # show a nice error if they type the email wrong
        if 'Unknown email' in e.message:
            return jsonify({'success': 0, 'results': e.message})
    return jsonify({'success': 1, 'results': results})
