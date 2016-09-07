import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import form_fields_required, json_error_response

logger = logging.getLogger(__name__)

# TODO: put in real API method once it is ready
@app.route('/api/topics/<topics_id>/permissions/list', methods=['GET'])
@flask_login.login_required
def topic_permissions_list(topics_id):
    return jsonify(
        {
            "permissions":
            [
                {
                    "email": "hroberts@cyber.law.harvard.edu",
                    "topics_id": topics_id,
                    "permission": "admin"
                },
                {
                    "email": "foo@foo.bar",
                    "topics_id": topics_id,
                    "permission": "read"
                }

            ]
        }
    )

# TODO: put in real API method once it is ready
@app.route('/api/topics/<topics_id>/permissions/update', methods=['PUT'])
@form_fields_required('email', 'permission')
@flask_login.login_required
def topic_update_permission(topics_id):
    email = request.form["email"]
    permission = request.form["permission"]
    if permission not in ['read', 'write', 'admin', 'none']:
        return json_error_response('Invalid permission value')
    return jsonify({
        "permissions": [
            {
                "email": email,
                "topics_id": topics_id,
                "permission": permission
            }
        ]
    })
