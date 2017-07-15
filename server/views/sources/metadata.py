import logging

import flask_login
from flask import jsonify

from server import app
from server.auth import user_admin_mediacloud_client
from server.util.request import api_error_handler
from server.util.tags import cached_tags_in_tag_set

logger = logging.getLogger(__name__)


@app.route('/api/metadata/<tag_sets_id>/values', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_metadata_values(tag_sets_id):
    '''
    Source metadata is encoded in varous tag sets - this returns the set and the list of
    available tags you can use
    '''
    user_mc = user_admin_mediacloud_client()
    tag_set = user_mc.tagSet(tag_sets_id)
    tag_set['tags'] = cached_tags_in_tag_set(tag_sets_id)
    return jsonify(tag_set)


