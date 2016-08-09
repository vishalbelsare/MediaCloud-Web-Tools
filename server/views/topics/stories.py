import logging
import json
from flask import jsonify, request
import flask_login

from server import app, mc
from server.views.topics import validated_sort
import server.views.util.csv as csv
from server.cache import cache

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/stories/<stories_id>', methods=['GET'])
#@flask_login.login_required
def story(topics_id, stories_id):
    story_info = mc.topicStoryList(topics_id, stories_id=stories_id)['stories'][0]
    story_info['media_name'] = mc.media(story_info['media_id'])['name']
    story_info['media_url'] = mc.media(story_info['media_id'])['url']
    return jsonify(story_info)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/words', methods=['GET'])
#@flask_login.login_required
def story_words(topics_id, stories_id):
    word_list = _story_words(topics_id, stories_id)
    return jsonify(word_list)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/words.csv', methods=['GET'])
#@flask_login.login_required
def story_words_csv(topics_id, stories_id):
    word_list = _story_words(topics_id, stories_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(word_list, props, 'story-'+str(stories_id)+'-words')

@cache
def _story_words(topics_id, stories_id):
    return mc.wordCount('stories_id:'+stories_id)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/inlinks', methods=['GET'])
#@flask_login.login_required
def story_inlinks(topics_id, stories_id):
    timespans_id = request.args.get('timespanId')
    inlinks = mc.topicStoryList(topics_id, link_to_stories_id=stories_id, timespans_id=timespans_id)
    return jsonify(inlinks)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/inlinks.csv', methods=['GET'])
#@flask_login.login_required
def story_inlinks_csv(topics_id, stories_id):
    timespans_id = request.args.get('timespanId')
    return _download_stories_csv('story-'+stories_id+'-inlinks', topics_id, link_to_stories_id=stories_id, timespans_id=timespans_id)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/outlinks', methods=['GET'])
#@flask_login.login_required
def story_outlinks(topics_id, stories_id):
    timespans_id = request.args.get('timespanId')
    outlinks = mc.topicStoryList(topics_id, link_from_stories_id=stories_id, timespans_id=timespans_id)
    return jsonify(outlinks)

@app.route('/api/topics/<topics_id>/stories/<stories_id>/outlinks.csv', methods=['GET'])
#@flask_login.login_required
def story_outlinks_csv(topics_id, stories_id):
    timespans_id = request.args.get('timespanId')
    return _download_stories_csv('story-'+stories_id+'-outlinks', topics_id, link_from_stories_id=stories_id, timespans_id=timespans_id)

@app.route('/api/topics/<topics_id>/stories', methods=['GET'])
#@flask_login.login_required
def topic_stories(topics_id):
    sort = validated_sort(request.args.get('sort'))
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    limit = request.args.get('limit')
    link_id = request.args.get('linkId')
    stories = mc.topicStoryList(topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id,
        sort=sort, limit=limit, link_id=link_id)
    return jsonify(stories)

@app.route('/api/topics/<topics_id>/stories.csv', methods=['GET'])
#@flask_login.login_required
def topic_stories_csv(topics_id):
    sort = validated_sort(request.args.get('sort'))
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    return _download_stories_csv('stories', topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id, sort=sort)

def _download_stories_csv(filename, topics_id, **kwargs):
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
            page = mc.topicStoryList(topics_id, **params)
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
