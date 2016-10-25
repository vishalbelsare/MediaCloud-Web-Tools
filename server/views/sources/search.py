import logging
from flask import jsonify, request
import flask_login

from server import app, db
from server.util.request import form_fields_required, api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name

logger = logging.getLogger(__name__)

@app.route('/api/sources/<str>/search', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def media_search(str):
    source_list = mc.mediaList(name_like=str)
    return jsonify({'results':source_list})