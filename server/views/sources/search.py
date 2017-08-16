import logging
from flask import jsonify, request
import flask_login
from multiprocessing import Pool
from server.views.media_search import media_search, _media_search_worker, _matching_tags_by_set

from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client, user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS
from server.views.sources.favorites import add_user_favorite_flag_to_sources, add_user_favorite_flag_to_collections

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)


@app.route('/api/sources/search/<search_str>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_search(search_str):
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
    results = _matching_tags_by_set(search_str, public_only)
    trimmed = [r[:MAX_COLLECTIONS] for r in results]
    flat_list = [item for sublist in trimmed for item in sublist]
    add_user_favorite_flag_to_collections(flat_list)
    return jsonify({'list': flat_list})
