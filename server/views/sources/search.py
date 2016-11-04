import logging
from flask import jsonify
import flask_login

from server import app
from server.util.request import  api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_client
from server.views.sources import COLLECTIONS_TAG_SET_ID

logger = logging.getLogger(__name__)

@app.route('/api/sources/<search_str>/search', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_search(search_str):
    source_list = _cached_media_search(search_str)[:5]
    return jsonify({'list':source_list})

@cache
def _cached_media_search(search_str):
    mc = user_mediacloud_client()
    return mc.mediaList(name_like=search_str)

@app.route('/api/collections/<search_str>/search', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_search(search_str):
    collection_list = _cached_collection_search(search_str)[:5]
    return jsonify({'list':collection_list})

def _cached_collection_search(search_str):
    mc = user_mediacloud_client()
    return mc.tagList(tag_sets_id=COLLECTIONS_TAG_SET_ID, public_only=True, name_like=search_str)

