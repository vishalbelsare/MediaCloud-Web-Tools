import logging
from flask import jsonify, request
import flask_login

from server import app
from server.auth import user_mediacloud_key
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS
from server.util.request import api_error_handler
from server.views.topics.apicache import topic_tag_coverage, cached_topic_timespan_list, _cached_topic_tag_counts
import server.util.csv as csv

logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE= 1000
DEFAULT_DISPLAY_AMOUNT= 10

ENTITY_DOWNLOAD_COLUMNS = ['label', 'count', 'pct', 'sample_size','tags_id']


def topTagsInSet(q, tag_sets_id, sample_size):
    user_mc_key = user_mediacloud_key()

    solr_query = parse_query_with_keywords(request.args)
    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.args['start_date'], split_end_date=request.args['end_date'], split=True)
    # make sure we return the query and the id passed in..

    #    for t in tag_counts:  # add in pct so user knows it was sampled
    #    t['pct'] = float(t['count']) / float(sample_size)
    return sentence_count_result


def process_tags_for_coverage(topics_id, tag_counts):

    tag_list = [i['tags_id'] for i in tag_counts]
    query_tags = " ".join(map(str, tag_list))
    coverage = topic_tag_coverage(topics_id, query_tags)  # gets count and total
    top_tag_counts = tag_counts[:DEFAULT_DISPLAY_AMOUNT]
    if coverage is None:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    coverage['entities'] = top_tag_counts
    return jsonify(coverage)


@app.route('/api/explorer/entities/people', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topEntitiesPeople(topics_id):

    top_tag_counts = topTagsInSet(topics_id, CLIFF_PEOPLE, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(topics_id, top_tag_counts)


@app.route('/api/explorer/entities/organizations', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topEntitiesOrganizations(topics_id):

    top_tag_counts = topTagsInSet(topics_id, CLIFF_ORGS, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(topics_id, top_tag_counts)

@app.route('/api/explorer/entities/<type_entity>/entities.csv', methods=['GET'])
@flask_login.login_required
def entities_csv(topics_id, type_entity):
    tag_type = CLIFF_PEOPLE if type_entity == 'people' else CLIFF_ORGS
    top_tag_counts = topTagsInSet(q, tag_type, DEFAULT_SAMPLE_SIZE)
    for tag in top_tag_counts:
        tag['sample_size'] = DEFAULT_SAMPLE_SIZE
    return csv.stream_response(top_tag_counts, ENTITY_DOWNLOAD_COLUMNS,
                               'topic-{}-entities-{}'.format(topics_id, type))
