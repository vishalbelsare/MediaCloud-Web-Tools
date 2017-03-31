import logging
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
from server.auth import is_user_logged_in, user_mediacloud_client
from server.cache import cache
from server.util.csv import stream_response
import server.util.tags as tags_util
from server.util.request import api_error_handler, arguments_required
from server.auth import user_mediacloud_key
from server.views.topics.apicache import topic_story_count
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/nyt-labels/coverage', methods=['GET'])
@api_error_handler
def topic_nyt_label_coverage(topics_id):
    q = "tags_id_stories:{}".format(tags_util.NYT_LABELER_1_0_0_TAG_ID)
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
    tags = _nyt_descriptor_tag_counts(user_mediacloud_key(), query, tags_util.NYT_LABELS_SAMPLE_SIZE)
    return stream_response(tags, ['tag', 'count', 'pct'], "topic-{}-nyt-label-counts".format(topics_id))


@app.route('/api/topics/<topics_id>/nyt-labels/counts', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_label_counts(topics_id):
    timespan_id = request.args["timespanId"]
    query = "{~ timespan:"+str(timespan_id)+"}"
    tags = _nyt_descriptor_tag_counts(user_mediacloud_key(), query, tags_util.NYT_LABELS_SAMPLE_SIZE)
    return jsonify({'results': tags})


@cache
def _nyt_descriptor_tag_counts(user_mc_key, query, sample_size):
    user_mc = user_mediacloud_client()
    tag_counts = user_mc.sentenceFieldCount('*', query, field='tags_id_stories',
                                            tag_sets_id=tags_util.NYT_LABELS_TAG_SET_ID, sample_size=sample_size)
    # remove the old labels from my first pass at using Taxonomic classifiers
    descriptor_tag_counts = [t for t in tag_counts if "Top/" not in t['tag']]
    # add in the pct so we can show relative values within the sample
    for t in descriptor_tag_counts:  # add in pct so user knows it was sampled
        t['pct'] = float(t['count']) / float(sample_size)
    return descriptor_tag_counts
