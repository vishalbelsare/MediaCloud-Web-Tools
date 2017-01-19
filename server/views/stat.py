import logging
from flask import jsonify, request
import flask_login

from server import app, auth
from server.auth import user_mediacloud_client
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)

@app.route('/api/system-stats', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def stats():
    user_mc = user_mediacloud_client()
    result = user_mc.stats()
    return jsonify({'stats': result})
