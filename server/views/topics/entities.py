import logging
from flask import jsonify
import flask_login

from server import app
from server.auth import user_mediacloud_key
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS
from server.util.request import api_error_handler
from server.views.topics.apicache import topic_tag_coverage, topic_tag_counts
import server.util.csv as csv

logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE = 1000
DEFAULT_DISPLAY_AMOUNT = 10

ENTITY_DOWNLOAD_COLUMNS = ['tags_id', 'label', 'count', 'sample_size', 'pct']


def top_tags_in_set(topics_id, tag_sets_id, sample_size):
    return topic_tag_counts(user_mediacloud_key(), topics_id, tag_sets_id, sample_size)
    '''    
    timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id)
    overall_timespan = [t for t in timespans if t['period'] == "overall"]
    overall_timespan = next(iter(overall_timespan))
    timespan_query = "timespans_id:{}".format(overall_timespan['timespans_id'])
    # can't call topic_tag_counts beca
    top_tag_counts = _cached_topic_tag_counts(user_mediacloud_key(), topics_id, tag_sets_id, sample_size,
                                              timespan_query)
    return top_tag_counts
    '''


def process_tags_for_coverage(topics_id, tag_counts):
    tag_list = [i['tags_id'] for i in tag_counts]
    query_tags = " ".join(map(str, tag_list))
    data = {
        'coverage': topic_tag_coverage(topics_id, query_tags)['counts'],  # gets count and total
    }
    top_tag_counts = tag_counts[:DEFAULT_DISPLAY_AMOUNT]
    data['entities'] = top_tag_counts
    return jsonify(data)


@app.route('/api/topics/<topics_id>/entities/people', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_top_people(topics_id):
    top_tag_counts = top_tags_in_set(topics_id, CLIFF_PEOPLE, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(topics_id, top_tag_counts)


@app.route('/api/topics/<topics_id>/entities/organizations', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_top_orgs(topics_id):
    top_tag_counts = top_tags_in_set(topics_id, CLIFF_ORGS, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(topics_id, top_tag_counts)


@app.route('/api/topics/<topics_id>/entities/<type_entity>/entities.csv', methods=['GET'])
@flask_login.login_required
def entities_csv(topics_id, type_entity):
    tag_type = CLIFF_PEOPLE if type_entity == 'people' else CLIFF_ORGS
    top_tag_counts = top_tags_in_set(topics_id, tag_type, DEFAULT_SAMPLE_SIZE)
    for tag in top_tag_counts:
        tag['sample_size'] = DEFAULT_SAMPLE_SIZE
    return csv.stream_response(top_tag_counts, ENTITY_DOWNLOAD_COLUMNS,
                               'topic-{}-entities-{}'.format(topics_id, type))
