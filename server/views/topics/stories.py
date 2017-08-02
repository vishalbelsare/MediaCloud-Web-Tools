import logging
import json
from flask import jsonify, request
import flask_login

from server import app, cliff, mc, TOOL_API_KEY
from server.auth import is_user_logged_in
from server.cache import cache
import server.util.csv as csv
from server.util.request import api_error_handler
from server.auth import user_mediacloud_key, user_admin_mediacloud_client
from server.views.topics.apicache import topic_story_count, topic_story_list, topic_word_counts
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)

GEONAMES_TAG_SET_ID = 1011
CLIFF_CLAVIN_2_3_0_TAG_ID = 9353691

@app.route('/api/topics/<topics_id>/stories/<stories_id>', methods=['GET'])
@api_error_handler
def story(topics_id, stories_id):

    local_mc = None
    if access_public_topic(topics_id):
        local_mc = mc
        story_topic_info = topic_story_list(TOOL_API_KEY, topics_id, stories_id=stories_id)['stories'][0]
    elif is_user_logged_in():
        local_mc = user_admin_mediacloud_client()
        story_topic_info = topic_story_list(user_mediacloud_key(), topics_id, stories_id=stories_id)['stories'][0]
    else:
        return jsonify({'status':'Error', 'message': 'Invalid attempt'})

    
    story_info = local_mc.story(stories_id)  # add in other fields from regular call
    for k in story_info.keys():
        if k not in story_topic_info.keys():
            story_topic_info[k] = story_info[k]
    for tag in story_info['story_tags']:
        if tag['tag_sets_id'] == GEONAMES_TAG_SET_ID:
            geonames_id = int(tag['tag'][9:])
            try:
                tag['geoname'] = _cached_geoname(geonames_id)
            except Exception as e:
                # query to CLIFF failed :-( handle it gracefull
                logger.exception(e)
                tag['geoname'] = {}
    return jsonify(story_topic_info)

@cache
def _cached_geoname(geonames_id):
    return cliff.geonamesLookup(geonames_id)

@app.route('/api/topics/<topics_id>/stories/counts', methods=['GET'])
@api_error_handler
def story_counts(topics_id):
    local_key = None
    if access_public_topic(topics_id):
        local_key = TOOL_API_KEY
    elif is_user_logged_in():
        local_key = user_mediacloud_key()
    else:
        return jsonify({'status':'Error', 'message': 'Invalid attempt'})
    total = topic_story_count(local_key, topics_id, timespans_id=None, q=None)
    filtered = topic_story_count(local_key, topics_id)  # force a count with just the query
    return jsonify({'counts':{'count': filtered['count'], 'total': total['count']}})


@app.route('/api/topics/<topics_id>/stories/english-counts', methods=['GET'])
@api_error_handler
def story_english_counts(topics_id):
    q = "language:en"
    if access_public_topic(topics_id):
        total = topic_story_count(TOOL_API_KEY, topics_id, q=None)
        in_english = topic_story_count(TOOL_API_KEY, topics_id, q=q)  # force a count with just the query
    elif is_user_logged_in():
        total = topic_story_count(user_mediacloud_key(), topics_id, q=None)
        in_english = topic_story_count(user_mediacloud_key(), topics_id, q=q)  # force a count with just the query
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify({'counts': {'count': in_english['count'], 'total': total['count']}})

@app.route('/api/topics/<topics_id>/stories/<stories_id>/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_words(topics_id, stories_id):
    word_list = topic_word_counts(user_mediacloud_key(), topics_id, q='stories_id:'+stories_id)[:100]
    return jsonify(word_list)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/words.csv', methods=['GET'])
@flask_login.login_required
def story_words_csv(topics_id, stories_id):
    word_list = topic_word_counts(user_mediacloud_key(), topics_id, q='stories_id:'+stories_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(word_list, props, 'story-'+str(stories_id)+'-words')

@app.route('/api/topics/<topics_id>/stories/<stories_id>/inlinks', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_inlinks(topics_id, stories_id):
    inlinks = topic_story_list(user_mediacloud_key(), topics_id, link_to_stories_id=stories_id)
    return jsonify(inlinks)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/inlinks.csv', methods=['GET'])
@flask_login.login_required
def story_inlinks_csv(topics_id, stories_id):
    return stream_story_list_csv(user_mediacloud_key(), 'story-'+stories_id+'-inlinks', topics_id, link_to_stories_id=stories_id)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/outlinks', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_outlinks(topics_id, stories_id):
    outlinks = topic_story_list(user_mediacloud_key(), topics_id, link_from_stories_id=stories_id)
    return jsonify(outlinks)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/outlinks.csv', methods=['GET'])
@flask_login.login_required
def story_outlinks_csv(topics_id, stories_id):
    return stream_story_list_csv(user_mediacloud_key(), 'story-'+stories_id+'-outlinks', topics_id, link_from_stories_id=stories_id)

@app.route('/api/topics/<topics_id>/stories', methods=['GET'])
@api_error_handler
def topic_stories(topics_id):
    local_mc = None
    if access_public_topic(topics_id):
        stories = topic_story_list(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None, foci_id=None, q=None)
    elif is_user_logged_in():
        stories = topic_story_list(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status':'Error', 'message': 'Invalid attempt'})

    return jsonify(stories)

@app.route('/api/topics/<topics_id>/stories.csv', methods=['GET'])
@flask_login.login_required
def topic_stories_csv(topics_id):
    as_attachment = True
    if ('attach' in request.args):
        as_attachment = request.args['attach'] == 1
    user_mc = user_admin_mediacloud_client()
    topic = user_mc.topic(topics_id)
    return stream_story_list_csv(user_mediacloud_key(), topic['name']+'-stories', topics_id, as_attachment=as_attachment)

def stream_story_list_csv(user_mc_key, filename, topics_id, **kwargs):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    as_attachment = kwargs['as_attachment'] if 'as_attachment' in kwargs else True
    all_stories = []
    more_stories = True
    params = kwargs
    if 'as_attachment' in params:
        del params['as_attachment']
    params['limit'] = 1000  # an arbitrary value to let us page through with big pages
    try:
        while more_stories:
            page = topic_story_list(user_mc_key, topics_id, **params)
            all_stories = all_stories + page['stories']
            if 'next' in page['link_ids']:
                params['link_id'] = page['link_ids']['next']
                more_stories = True
            else:
                more_stories = False
        props = ['stories_id', 'publish_date', 'date_is_reliable', 
            'title', 'url', 'media_id', 'media_name',
            'media_inlink_count', 'inlink_count',
            'outlink_count', 'bitly_click_count', 'facebook_share_count', 'language']
        return csv.stream_response(all_stories, props, filename, as_attachment=as_attachment)
    except Exception as e:
        logger.exception(e)
        return json.dumps({'error': str(e)}, separators=(',', ':')), 400
