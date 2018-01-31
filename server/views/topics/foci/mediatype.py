import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import api_error_handler, json_error_response, form_fields_required, arguments_required
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.apicache import topic_tag_coverage, _cached_topic_tag_counts, cached_topic_timespan_list
from server.views.topics.foci import FOCAL_TECHNIQUE_BOOLEAN_QUERY
from server.util.tags import TAG_SETS_ID_MEDIA_TYPE
import json
logger = logging.getLogger(__name__)

DEFAULT_SAMPLE_SIZE = 5000

def get_media_type_by_sentence_field_counts(topics_id, num_media_type):
    tag_media_type_counts= []

    # get the total stories for a topic
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']

    # get the top countries by the sentence field counts iwth overall timespan
    timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id)
    overall_timespan = [t for t in timespans if t['period'] == "overall"]
    overall_timespan = next(iter(overall_timespan))
    timespan_query = "timespans_id:{}".format(overall_timespan['timespans_id'])
    top_media_type_tags = _cached_topic_tag_counts(user_mediacloud_key(), topics_id, TAG_SETS_ID_MEDIA_TYPE, DEFAULT_SAMPLE_SIZE, timespan_query)
    
    # get the total stories for a topic
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # for each country, set up the requisite info for UI
    for tag in top_media_type_tags:
        tag_media_type_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tag['count'],
            'pct': float(tag['count']) / float(total_stories), #sentence_field_count / total story per topic count
        })

    return tag_media_type_counts


@app.route('/api/topics/<topics_id>/focal-sets/media-type/preview/story-counts', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaTypeSelected')
@api_error_handler
def media_type_story_counts(topics_id):
    # using sentence field count to approximate story mentions by top country
    num_media_type = int(request.args['mediaTypeSelected'])
    return jsonify({'story_counts': get_media_type_by_sentence_field_counts(topics_id, num_media_type)})


@app.route('/api/topics/<topics_id>/focal-sets/media-type/preview/coverage', methods=['GET'])
@flask_login.login_required
@arguments_required('mediaTypeSelected')
@api_error_handler
def media_type_coverage(topics_id):
    num_media_type = int(request.args['mediaTypeSelected'])
    tag_media_type_counts = get_media_type_by_sentence_field_counts(topics_id, num_media_type)

    # get the count for all stories tagged with these top country tags
    tag_list = [i['tags_id'] for i in tag_media_type_counts]
    query_media_type_tags = "({})".format(" ".join(map(str, tag_list)))
    coverage = topic_tag_coverage(topics_id, query_media_type_tags)   # gets count and total

    if coverage is None:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify(coverage)


@app.route('/api/topics/<topics_id>/focal-sets/media-type/create', methods=['POST'])
@form_fields_required('focalSetName', 'focalSetDescription', 'data[]')
@flask_login.login_required
def create_media_type_focal_set(topics_id):
    user_mc = user_mediacloud_client()
    # grab the focalSetName and focalSetDescription and then make one
    focal_set_name = request.form['focalSetName']
    focal_set_description = request.form['focalSetDescription']
    country_data = json.loads(request.form['data[]'])
    focal_technique = FOCAL_TECHNIQUE_BOOLEAN_QUERY
    new_focal_set = user_mc.topicFocalSetDefinitionCreate(topics_id, focal_set_name, focal_set_description, focal_technique)
    if 'focal_set_definitions_id' not in new_focal_set:
        return json_error_response('Unable to create the subtopic set')
    # now make the foci in it - one for each country
    focus_def_results = []
    for tag in country_data:
        params = {
            'name': tag['label'],
            'description': u"Stories about {}".format(tag['label']),
            'query': "tags_id_stories:{}".format(tag['tags_id']),
            'focal_set_definitions_id': new_focal_set['focal_set_definitions_id'],
        }
        result = user_mc.topicFocusDefinitionCreate(topics_id, **params)
        focus_def_results.append(result)
    return {'success': True}
