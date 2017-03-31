import logging
from flask import jsonify, request
import flask_login

from server import app
from server.views.topics.apicache import topic_tag_coverage, topic_tag_counts
from server.util.csv import stream_response
import server.util.tags as tags_util
from server.util.request import api_error_handler, arguments_required
from server.auth import user_mediacloud_key

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/nyt-tags/coverage', methods=['GET'])
@api_error_handler
def topic_nyt_tag_coverage(topics_id):
    coverage = topic_tag_coverage(topics_id, tags_util.NYT_LABELER_1_0_0_TAG_ID)
    if coverage is None:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify(coverage)


@app.route('/api/topics/<topics_id>/nyt-tags/counts.csv', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_tag_counts_csv(topics_id):
    timespans_id = request.args["timespanId"]
    tags = _nyt_tag_counts(user_mediacloud_key(), timespans_id)
    return stream_response(tags, ['tag', 'count', 'pct'], "topic-{}-nyt-label-counts".format(topics_id))


@app.route('/api/topics/<topics_id>/nyt-tags/counts', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_tag_counts(topics_id):
    timespans_id = request.args["timespanId"]
    tags = _nyt_tag_counts(user_mediacloud_key(), timespans_id)
    return jsonify({'results': tags})


def _nyt_tag_counts(user_mc_key, timespans_id):
    tag_counts = topic_tag_counts(user_mc_key, timespans_id, tags_util.NYT_LABELS_TAG_SET_ID,
                                  tags_util.NYT_LABELS_SAMPLE_SIZE)
    # remove the old labels from my first pass at using Taxonomic classifiers
    descriptor_tag_counts = [t for t in tag_counts if "Top/" not in t['tag']]
    return descriptor_tag_counts
