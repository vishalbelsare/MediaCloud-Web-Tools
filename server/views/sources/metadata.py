import logging
from flask import jsonify
import flask_login

from server import app
from server.util.request import  api_error_handler

logger = logging.getLogger(__name__)

@app.route('/api/metadata/<tag_sets_id>/values', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_metadata_values(tag_sets_id):
    '''
    Source metadata is encoded in varous tag sets - this returns the set and the list of
    available tags you can use
    '''
    values = [
        {'label': 'English', 'tag': 'ENG', 'tags_id': 211, 'tag_sets_id': int(tag_sets_id)},
        {'label': 'Spanish', 'tag': 'SPA', 'tags_id': 212, 'tag_sets_id': int(tag_sets_id)},
        {'label': 'Portuguese', 'tag': 'POR', 'tags_id': 213, 'tag_sets_id': int(tag_sets_id)},
        {'label': 'Hindi', 'tag': 'HIN', 'tags_id': 214, 'tag_sets_id': int(tag_sets_id)},
    ]
    tag_set = {
        'description': 'Fake languages ones',
        'label': u'Language Used',
        'name': u'language-used',
        'show_on_media': 0,
        'show_on_stories': None,
        'tag_sets_id': int(tag_sets_id),
        'tags': values,
    }
    return jsonify(tag_set)
