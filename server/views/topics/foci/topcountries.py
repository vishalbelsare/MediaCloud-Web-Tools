import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import api_error_handler, json_error_response, form_fields_required
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.apicache import topic_tag_coverage, topic_tag_counts
from server.views.topics.foci import FOCAL_TECHNIQUE_BOOLEAN_QUERY
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3
import server.util.tags as tag_util

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/focal-sets/top-countries/preview/story-counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_countries_story_counts(topics_id):
    user_mc_key = user_mediacloud_key()
    tag_story_counts = []
    tag_counts = topic_tag_counts(user_mc_key, topics_id, tag_util.GEO_TAG_SET,
                                  tag_util.GEO_SAMPLE_SIZE)

    # make sure this tag is in geo_tags whitelist
    country_tag_counts = [r for r in tag_counts if
                                       int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    for tag in country_tag_counts:
        geonamesId = int(r['tag'].split('_')[1])
        if geonamesId not in COUNTRY_GEONAMES_ID_TO_APLHA3.keys():  # only include countries
            continue
        tag['geonamesId'] = geonamesId
        #total_stories =
        tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id)
        tag_story_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tagged_story_count,
            # 'pct': float(tagged_story_count)/float(total_stories)
        })

    return jsonify({'story_counts': tag_story_counts})


@app.route('/api/topics/<topics_id>/focal-sets/top-countries/preview/coverage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_countries_coverage(topics_id):
    coverage = topic_tag_coverage(topics_id, tag_util.CLIFF_CLAVIN_2_3_0_TAG_ID)   # this will respect filters
    if coverage is None:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify(coverage)





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
