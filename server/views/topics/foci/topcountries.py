import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import api_error_handler, json_error_response, form_fields_required
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.apicache import topic_tag_coverage, _cached_topic_tag_counts, cached_topic_timespan_list
from server.views.topics.foci import FOCAL_TECHNIQUE_BOOLEAN_QUERY
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3
from server.util.tags import GEO_TAG_SET, GEO_SAMPLE_SIZE, CLIFF_CLAVIN_2_3_0_TAG_ID
logger = logging.getLogger(__name__)


def get_top_countries_by_sentence_field_counts(topics_id):
    user_mc_key = user_mediacloud_key()
    tag_country_counts = []

    timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id)

    overall_timespan = [t for t in timespans if t['period'] == "overall"]
    overall_timespan = next(iter(overall_timespan))
    timespan_query = "timespans_id:{}".format(overall_timespan['timespans_id'])

    # get the top countries by the sentence field counts
    top_geo_tags = _cached_topic_tag_counts(user_mediacloud_key(), topics_id, GEO_TAG_SET, GEO_SAMPLE_SIZE, timespan_query)
    # get the total stories for a topic
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # make sure the geo tag is in the geo_tags whitelist (is a country)
    country_tag_counts = [r for r in top_geo_tags if
                                       int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    top_countries_story_count = 0 
    # for each country, set up the requisite info for UI                                  
    for tag in country_tag_counts:
        geonamesId = int(tag['tag'].split('_')[1])
        #tag['geonamesId'] = geonamesId

        tag_country_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tag['count'],
            'pct': float(tag['count']) / float(total_stories), #sentence_field_count / total story per topic count
        })

    # stories overall for topic
    tag_country_counts['total'] = total_stories
    return tag_country_counts



@app.route('/api/topics/<topics_id>/focal-sets/top-countries/preview/story-counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_countries_story_counts(topics_id):
    
    return jsonify({'story_counts': get_top_countries_by_sentence_field_counts(topics_id)})


@app.route('/api/topics/<topics_id>/focal-sets/top-countries/preview/coverage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_countries_coverage(topics_id):

    tag_country_counts = get_top_countries_by_sentence_field_counts(topics_id) 

# get all stories according to the top country tags
# query_with_tag = format ...[tag: id for tag in tag_country_counts]
#tagged = topic_story_count(TOOL_API_KEY, topics_id, q=query_with_tag )

    #coverage = topic_tag_coverage(topics_id, tag['id'])   # all stories
    #if coverage is None:
    #    return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify(country_story_counts)





@app.route('/api/topics/<topics_id>/focal-sets/top-countries/create', methods=['POST'])
@form_fields_required('focalSetName', 'focalSetDescription')
@flask_login.login_required
def create_top_countries_focal_set(topics_id):
    user_mc = user_mediacloud_client()
    # grab the focalSetName and focalSetDescription and then make one
    focal_set_name = request.form['focalSetName']
    focal_set_description = request.form['focalSetDescription']
    focal_technique = FOCAL_TECHNIQUE_BOOLEAN_QUERY
    new_focal_set = user_mc.topicFocalSetDefinitionCreate(topics_id, focal_set_name, focal_set_description, focal_technique)
    if 'focal_set_definitions_id' not in new_focal_set:
        return json_error_response('Unable to create the subtopic set')
    # now make the foci in it - one for each partisanship quintile

    return {'success': True}
