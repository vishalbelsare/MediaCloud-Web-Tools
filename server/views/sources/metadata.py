import logging
from flask import jsonify
import flask_login

from server import app, mc
from server.util.request import  api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client

logger = logging.getLogger(__name__)

@app.route('/api/metadata/<tag_sets_id>/values', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_metadata_values(tag_sets_id):
    '''
    Source metadata is encoded in varous tag sets - this returns the set and the list of
    available tags you can use
    '''
    user_mc = user_mediacloud_client()
    tag_set = user_mc.tagSet(tag_sets_id)
    tag_set['tags'] = _cached_tags_in_tag_set(tag_sets_id)
    return jsonify(tag_set)

@cache
def _cached_tags_in_tag_set(tag_sets_id):
    '''
    This is cached at the app level, so it doesn't need a user key.  This is because
    the list of tags here shouldn't change (ie. metadata values don't change within a category)
    '''
    all_tags = []
    last_id = 0
    more = True
    while more:
        current_list = mc.tagList(tag_sets_id=tag_sets_id, rows=100, last_tags_id=last_id)
        last_id = current_list[-1]['tags_id']
        more = (len(current_list) == 100) and (len(current_list) != 0)
        all_tags = all_tags + current_list
    return all_tags
