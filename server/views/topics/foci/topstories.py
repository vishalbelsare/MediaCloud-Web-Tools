import logging
from flask import jsonify, request
import flask_login

from server import app
from server.cache import cache
from server.util.request import api_error_handler, json_error_response, form_fields_required
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.util.tags import cached_tags_in_tag_set, media_with_tag, TAG_SETS_ID_TOP_COUNTRIES
from server.views.topics.foci import FOCAL_TECHNIQUE_BOOLEAN_QUERY

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/focal-sets/top-countries/preview/story-counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_countries_story_counts(topics_id):
    # TODO: add in overall timespan id here so it works in different snapshots
    tag_story_counts = []
    partisanship_tags = cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # make a count for each tag based on media_od
    for tag in partisanship_tags:
        tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=tag['media_query'])['count']
        tag_story_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tagged_story_count,
            'pct': float(tagged_story_count)/float(total_stories)
        })
    # order them in the way a person would expect ( left to center to right)
    ordered_tag_story_counts = list()
    ordered_tag_story_counts.append([t for t in tag_story_counts if t['tags_id'] == 9360520][0])

    return jsonify({'story_counts': ordered_tag_story_counts})


@app.route('/api/topics/<topics_id>/focal-sets/top-countries/preview/coverage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def top_countries_coverage(topics_id):
    # TODO: add in overall timespan id here so it works in different snapshots
    partisanship_tags = cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # count the stories in any media in tagged as partisan
    tag_media_ids = [" ".join(tag['media_ids']) for tag in partisanship_tags]
    all_media_ids = " ".join(tag_media_ids)
    media_ids_query_clause = "media_id:({})".format(all_media_ids)
    tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=media_ids_query_clause)['count']
    return jsonify({'counts': {'count': tagged_story_count, 'total': total_stories}})


def cached_media_tags(tag_sets_id):
    partisanship_tags = cached_tags_in_tag_set(tag_sets_id)
    for tag in partisanship_tags:
        media = media_with_tag(user_mediacloud_key(), tag['tags_id'], True)  # cache this list
        media_ids = [str(m['media_id']) for m in media] # as strs so we can concat into a query str later with .join call
        tag['media'] = media
        tag['media_ids'] = media_ids
        tag['media_query'] = "media_id:({})".format(" ".join(media_ids))
    return partisanship_tags


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
    partisanship_tags = cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    for tag in partisanship_tags:
        name = tag['label']
        description = "Media sources that were retweeted more often during the 2016 US election season by people on the {}".format(tag['label'])
        query = tag['media_query']
        focal_set_definitions_id = new_focal_set['focal_set_definitions_id']
        # create a new boolean query subtopic based on tag['media_query']
        new_focus = user_mc.topicFocusDefinitionCreate(topics_id,
                                                       name=name, description=description, query=query,
                                                       focal_set_definitions_id=focal_set_definitions_id)
        if (len(new_focus) == 0) or ('focus_definitions_id' not in new_focus[0]):
            return json_error_response('Unable to create the {} subtopic'.format(name))
    return {'success': True}
