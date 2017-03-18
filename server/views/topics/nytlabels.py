import logging
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
from server.auth import is_user_logged_in, user_mediacloud_client
from server.cache import cache
from server.util.csv import stream_response
from server.util.request import api_error_handler, arguments_required
from server.auth import user_mediacloud_key
from server.views.topics.apicache import topic_story_count
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)

NYT_LABELER_1_0_0_TAG_ID = 9360669
NYT_LABELS_TAG_SET_ID = 1963
NYT_LABELS_SAMPLE_SIZE = 10000


@app.route('/api/topics/<topics_id>/nyt-labels/coverage', methods=['GET'])
@api_error_handler
def topic_nyt_label_coverage(topics_id):
    q = "tags_id_stories:"+str(NYT_LABELER_1_0_0_TAG_ID)
    if access_public_topic(topics_id):
        total = topic_story_count(TOOL_API_KEY, topics_id, q=None)
        tagged = topic_story_count(TOOL_API_KEY, topics_id, q=q)  # force a count with just the query
    elif is_user_logged_in():
        total = topic_story_count(user_mediacloud_key(), topics_id, q=None)
        tagged = topic_story_count(user_mediacloud_key(), topics_id, q=q)  # force a count with just the query
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify({'counts': {'count': tagged['count'], 'total': total['count']}})


@app.route('/api/topics/<topics_id>/nyt-labels/counts.csv', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_label_counts_csv(topics_id):
    timespan_id = request.args["timespanId"]
    query = "{~ timespan:" + str(timespan_id) + "}"
    tags = _nyt_label_count(user_mediacloud_key(), query, NYT_LABELS_SAMPLE_SIZE)
    return stream_response(tags, ['tag', 'count'], 'nyt-label-counts')


@app.route('/api/topics/<topics_id>/nyt-labels/counts', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_label_counts(topics_id):
    timespan_id = request.args["timespanId"]
    query = "{~ timespan:"+str(timespan_id)+"}"
    tags = _nyt_label_count(user_mediacloud_key(), query, NYT_LABELS_SAMPLE_SIZE)
    data_by_path = {}   # keyed by full path to data
    # breakout and sum the counts based on the hierarchy
    for tag in tags:
        tag['count'] = float(tag['count']) / float(NYT_LABELS_SAMPLE_SIZE)  # turn it into a pct
        sections = tag['tag'].split("/")
        paths = []
        for idx, section in enumerate(sections):
            path = {
                'name': section,
                'path': "/".join(sections[0:idx+1]),
                'parent': "/".join(sections[0:idx]) if idx > 0 else None,
                'count': 0,
                'children': []
            }
            paths.append(path)
        for path in paths:
            if path['path'] not in data_by_path:
                data_by_path[path['path']] = path
            data_by_path[path['path']]['count'] += tag['count']
    # now turn it into a tree of results
    for path_name, path in data_by_path.iteritems():
        if path['parent'] is not None:
            data_by_path[path['parent']]['children'].append(path)
    return jsonify({'tree': data_by_path['Top']})


@cache
def _nyt_label_count(user_mc_key, query, sample_size):
    user_mc = user_mediacloud_client()
    res = user_mc.sentenceFieldCount('*', query, field='tags_id_stories', tag_sets_id=NYT_LABELS_TAG_SET_ID,
                                     sample_size=sample_size)
    return res
