import logging
from flask import jsonify, request
import flask_login

from server import app
from server.auth import user_mediacloud_key, user_admin_mediacloud_client
from server.util.tags import CLIFF_PEOPLE, CLIFF_ORGS
from server.util.request import api_error_handler
from server.views.topics.apicache import topic_tag_coverage
import server.util.csv as csv
from server.views.explorer import parse_query_with_keywords

logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE= 1000
DEFAULT_DISPLAY_AMOUNT= 10

ENTITY_DOWNLOAD_COLUMNS = ['label', 'count', 'pct', 'sample_size','tags_id']


def top_tags_in_set(solr_query, tag_sets_id, sample_size):
    user_mc_key = user_mediacloud_key()
    user_mc = user_admin_mediacloud_client()
    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.args['start_date'], split_end_date=request.args['end_date'], split=True)
    # make sure we return the query and the id passed in..

    #    for t in tag_counts:  # add in pct so user knows it was sampled
    #    t['pct'] = float(t['count']) / float(sample_size)
    return sentence_count_result


def process_tags_for_coverage(solr_query, tag_counts):

    tag_list = [i['tags_id'] for i in tag_counts]
    # if logged in.. or
    user_mc = user_admin_mediacloud_client()
    query_tags = " ".join(map(str, tag_list))
    # coverage = topic_tag_coverage(q, query_tags)  # gets count and total
    coverage = user_mc.storyCount(solr_query, tag_list)
    top_tag_counts = tag_counts[:DEFAULT_DISPLAY_AMOUNT]
    if coverage is None:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    coverage['entities'] = top_tag_counts
    return jsonify(coverage)


@app.route('/api/explorer/entities/people', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_entities_people():
    solr_query = parse_query_with_keywords(request.args)
    top_tag_counts = top_tags_in_set(solr_query, CLIFF_PEOPLE, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(solr_query, top_tag_counts)


@app.route('/api/explorer/entities/organizations', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_entities_organizations():
    solr_query = parse_query_with_keywords(request.args)
    top_tag_counts = top_tags_in_set(solr_query, CLIFF_ORGS, DEFAULT_SAMPLE_SIZE)
    return process_tags_for_coverage(solr_query, top_tag_counts)

@app.route('/api/explorer/entities/<type_entity>/entities.csv', methods=['GET'])
@flask_login.login_required
def explorer_entities_csv(topics_id, type_entity):
    tag_type = CLIFF_PEOPLE if type_entity == 'people' else CLIFF_ORGS
    top_tag_counts = top_tags_in_set(q, tag_type, DEFAULT_SAMPLE_SIZE)
    for tag in top_tag_counts:
        tag['sample_size'] = DEFAULT_SAMPLE_SIZE
    return csv.stream_response(top_tag_counts, ENTITY_DOWNLOAD_COLUMNS,
                               'topic-{}-entities-{}'.format(topics_id, type))
