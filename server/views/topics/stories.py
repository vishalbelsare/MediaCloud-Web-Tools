import logging
import json
from flask import jsonify, request
import flask_login

from server import app
import server.util.csv as csv
from server.util.request import api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.apicache import topic_story_count, topic_story_list, topic_word_counts

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/stories/<stories_id>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story(topics_id, stories_id):
    user_mc = user_mediacloud_client()
    story_info = topic_story_list(user_mediacloud_key(), topics_id, stories_id=stories_id)['stories'][0]
    # TODO: remove this when these get added to the results of the query
    story_info['media_name'] = user_mc.media(story_info['media_id'])['name']
    story_info['media_url'] = user_mc.media(story_info['media_id'])['url']
    return jsonify(story_info)

@app.route('/api/topics/<topics_id>/stories/counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_counts(topics_id):
    total = topic_story_count(user_mediacloud_key(), topics_id, timespans_id=None, q=None)  # override the default behaviour, which is to pull the timespans id off the request params
    filtered = topic_story_count(user_mediacloud_key(), topics_id, timespans_id=None)  # this will read the timespan off the query args
    return jsonify({'counts':{'filtered': filtered['count'], 'total': total['count']}})

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
@flask_login.login_required
@api_error_handler
def topic_stories(topics_id):
    stories = topic_story_list(user_mediacloud_key(), topics_id)
    return jsonify(stories)

@app.route('/api/topics/<topics_id>/stories.csv', methods=['GET'])
@flask_login.login_required
def topic_stories_csv(topics_id):
    return stream_story_list_csv(user_mediacloud_key(), 'stories', topics_id)

def stream_story_list_csv(user_mc_key, filename, topics_id, **kwargs):
    '''
    Helper method to strem a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    all_stories = []
    more_stories = True
    params = kwargs
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
        props = ['stories_id', 'publish_date', 'title', 'url', 'media_id',
            'media_inlink_count', 'inlink_count',
            'outlink_count', 'bitly_click_count', 'facebook_share_count', 'language']
        return csv.stream_response(all_stories, props, filename)
    except Exception as exception:
        return json.dumps({'error':str(exception)}, separators=(',', ':')), 400
