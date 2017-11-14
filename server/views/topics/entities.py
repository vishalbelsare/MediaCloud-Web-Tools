import logging
from flask import jsonify, request
import flask_login

from server import app
from server.auth import user_mediacloud_key
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS
from server.util.request import api_error_handler
from server.views.topics.apicache import topic_tag_coverage, cached_topic_timespan_list, _cached_topic_tag_counts

logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE= 1000


def topTagsInSet(topics_id, tag_sets_id, sample_size):
    user_mc_key = user_mediacloud_key()

    timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id)

    overall_timespan = [t for t in timespans if t['period'] == "overall"]
    overall_timespan = next(iter(overall_timespan))
    timespan_query = "timespans_id:{}".format(overall_timespan['timespans_id'])

    top_tag_counts = _cached_topic_tag_counts(user_mediacloud_key(), topics_id, tag_sets_id, sample_size,
                                              timespan_query)

    return top_tag_counts

@app.route('/api/topics/<topics_id>/entities/people', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topicsEntitiesPeople(topics_id):

    top_tag_counts = topTagsInSet(topics_id, CLIFF_PEOPLE, DEFAULT_SAMPLE_SIZE)
    tag_list = [i['tags_id'] for i in top_tag_counts]
    query_tags = " ".join(map(str, tag_list))
    coverage = topic_tag_coverage(topics_id, query_tags)   # gets count and total

    if coverage is None:
       return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify(coverage)

@app.route('/api/topics/<topics_id>/entities/organizations', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topicsEntitiesOrganizations(topics_id):
    return topTagsInSet(topics_id, CLIFF_ORGS, DEFAULT_SAMPLE_SIZE)

