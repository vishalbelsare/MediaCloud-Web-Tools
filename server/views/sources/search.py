import logging
from flask import jsonify, request
import flask_login
from server.views.media_search import media_search, _matching_collections_by_set

from server import app
from server.util.request import api_error_handler
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS
from server.auth import user_has_auth_role, ROLE_MEDIA_EDIT
from server.views.sources.favorites import add_user_favorite_flag_to_sources, add_user_favorite_flag_to_collections

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20


@app.route('/api/sources/search/<search_str>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_media_search(search_str):
    tags = None
    cleaned_search_str = None if search_str == '*' else search_str
    if 'tags[]' in request.args:
        tags = request.args['tags[]'].split(',')
    if tags is None:
        source_list = media_search(cleaned_search_str)[:MAX_SOURCES]
    else:
        source_list = media_search(cleaned_search_str, tags_id=tags[0])[:MAX_SOURCES]
    add_user_favorite_flag_to_sources(source_list)
    return jsonify({'list':source_list})


@app.route('/api/collections/search/<search_str>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_search(search_str):
    public_only = False if user_has_auth_role(ROLE_MEDIA_EDIT) else True
    results = _matching_collections_by_set(search_str, public_only, VALID_COLLECTION_TAG_SETS_IDS)
    trim_count = MAX_COLLECTIONS if len(results) > 20 else len(results)
    trimmed = results[:trim_count]
    flat_list = [{'tags_id':t['tags_id']} for t in trimmed]
    add_user_favorite_flag_to_collections(flat_list)
    return jsonify({'list': flat_list})
