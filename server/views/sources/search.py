import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import  api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_client
from server.views.sources import COLLECTIONS_TAG_SET_ID, GV_TAG_SET_ID, EMM_TAG_SET_ID
from server.views.sources.favorites import _add_user_favorite_flag_to_sources, _add_user_favorite_flag_to_collections

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20

@app.route('/api/sources/search/<search_str>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_search(search_str):
    tags = None
    cleaned_search_str = None if search_str == '*' else search_str
    if 'tags[]' in request.args:
        tags = request.args['tags[]'].split(',')
    if tags is None:
        source_list = _cached_media_search(cleaned_search_str)[:MAX_SOURCES]
    else:
        source_list = _cached_media_search(cleaned_search_str, tags_id=tags[0])[:MAX_SOURCES]
    _add_user_favorite_flag_to_sources(source_list)
    return jsonify({'list':source_list})

@cache
def _cached_media_search(search_str, tags_id=None):
    mc = user_mediacloud_client()
    return mc.mediaList(name_like=search_str, tags_id=tags_id)

@app.route('/api/collections/search/<search_str>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_search(search_str):
    results = _cached_collection_search(search_str)
    trimmed = [ r[:MAX_COLLECTIONS] for r in results]
    flat_list = [item for sublist in trimmed for item in sublist]
    _add_user_favorite_flag_to_collections(flat_list)
    return jsonify({'list': flat_list})

def _cached_collection_search(search_str):
    mc = user_mediacloud_client()
    mc_results = mc.tagList(tag_sets_id=COLLECTIONS_TAG_SET_ID, public_only=True, name_like=search_str)
    gv_results = mc.tagList(tag_sets_id=GV_TAG_SET_ID, public_only=True, name_like=search_str)
    emm_results = mc.tagList(tag_sets_id=EMM_TAG_SET_ID, public_only=True, name_like=search_str)
    return [mc_results, emm_results, gv_results]


