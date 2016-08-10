import logging
import json
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache
from server.views.topics import validated_sort
import server.views.util.csv as csv
from server.views.topics.sentences import split_sentence_count, stream_sentence_count_csv
from server.views.topics.stories import stream_story_list_csv

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/media', methods=['GET'])
@flask_login.login_required
def topic_media(topics_id):
    sort = validated_sort(request.args.get('sort'))
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    limit = request.args.get('limit')
    link_id = request.args.get('linkId')
    media_list = mc.topicMediaList(topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id, sort=sort,
        limit=limit, link_id=link_id)
    return jsonify(media_list)

@app.route('/api/topics/<topics_id>/media/<media_id>', methods=['GET'])
@flask_login.login_required
def media(topics_id, media_id):
    timespans_id = request.args.get('timespanId')
    media_info = mc.topicMediaList(topics_id, media_id=media_id, timespans_id=timespans_id)['media'][0]
    return jsonify(media_info)

@app.route('/api/topics/<topics_id>/media.csv', methods=['GET'])
@flask_login.login_required
def topic_media_csv(topics_id):
    sort = validated_sort(request.args.get('sort'))
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    return _stream_media_list_csv('media', topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id, sort=sort)

@app.route('/api/topics/<topics_id>/media/<media_id>/sentences/count', methods=['GET'])
def topic_media_sentence_count(topics_id, media_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    return jsonify(split_sentence_count(topics_id, snapshots_id, timespans_id, fq='media_id:'+media_id))

@app.route('/api/topics/<topics_id>/media/<media_id>/sentences/count.csv', methods=['GET'])
def topic_media_sentence_count_csv(topics_id, media_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    return stream_sentence_count_csv('sentence-counts', topics_id, snapshots_id, timespans_id,
        fq="media_id:"+media_id)

@app.route('/api/topics/<topics_id>/media/<media_id>/stories', methods=['GET'])
@flask_login.login_required
def media_stories(topics_id, media_id):
    sort = validated_sort(request.args.get('sort'))
    limit = request.args.get('limit')
    timespans_id = request.args.get('timespanId')
    stories = mc.topicStoryList(topics_id, media_id=media_id, timespans_id=timespans_id, sort=sort, limit=limit)
    return jsonify(stories)

@app.route('/api/topics/<topics_id>/media/<media_id>/stories.csv', methods=['GET'])
@flask_login.login_required
def media_stories_csv(topics_id, media_id):
    timespans_id = request.args.get('timespanId')
    return stream_story_list_csv('media-'+media_id+'-stories', topics_id, media_id=media_id, timespans_id=timespans_id)

@app.route('/api/topics/<topics_id>/media/<media_id>/inlinks', methods=['GET'])
@flask_login.login_required
def media_inlinks(topics_id, media_id):
    sort = validated_sort(request.args.get('sort'))
    limit = request.args.get('limit')
    timespans_id = request.args.get('timespanId')
    inlinks = mc.topicStoryList(topics_id, link_to_media_id=media_id, timespans_id=timespans_id, sort=sort, limit=limit)
    return jsonify(inlinks)

@app.route('/api/topics/<topics_id>/media/<media_id>/inlinks.csv', methods=['GET'])
@flask_login.login_required
def media_inlinks_csv(topics_id, media_id):
    timespans_id = request.args.get('timespanId')
    return stream_story_list_csv('media-'+media_id+'-inlinks', topics_id, link_to_media_id=media_id, timespans_id=timespans_id)

@app.route('/api/topics/<topics_id>/media/<media_id>/outlinks', methods=['GET'])
@flask_login.login_required
def media_outlinks(topics_id, media_id):
    sort = validated_sort(request.args.get('sort'))
    limit = request.args.get('limit')
    timespans_id = request.args.get('timespanId')
    outlinks = mc.topicStoryList(topics_id, link_from_media_id=media_id, timespans_id=timespans_id, sort=sort, limit=limit)
    return jsonify(outlinks)

@app.route('/api/topics/<topics_id>/media/<media_id>/outlinks.csv', methods=['GET'])
@flask_login.login_required
def media_outlinks_csv(topics_id, media_id):
    timespans_id = request.args.get('timespanId')
    return stream_story_list_csv('media-'+media_id+'-outlinks', topics_id, link_from_media_id=media_id, timespans_id=timespans_id)

def _stream_media_list_csv(filename, topics_id, **kwargs):
    '''
    Helper method to stream a list of media back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicMediaList.
    '''
    all_media = []
    more_media = True
    params = kwargs
    params['limit'] = 1000  # an arbitrary value to let us page through with big pages
    try:
        while more_media:
            page = mc.topicMediaList(topics_id, **params)
            all_media = all_media + page['stories']
            if 'next' in page['link_ids']:
                params['link_id'] = page['link_ids']['next']
                more_media = True
            else:
                more_media = False
        props = ['media_id', 'name', 'url', 'story_count',
                 'media_inlink_count', 'sum_media_inlink_count', 'inlink_count',
                 'outlink_count', 'bitly_click_count', 'facebook_share_count']
        return csv.stream_response(all_media, props, filename)
    except Exception as exception:
        return json.dumps({'error':str(exception)}, separators=(',', ':')), 400

@app.route('/api/topics/<topics_id>/media/<media_id>/words', methods=['GET'])
@flask_login.login_required
def media_words(topics_id, media_id):
    timespans_id = request.args.get('timespanId')
    word_list = _media_words(topics_id, media_id, timespans_id)[:100]
    return jsonify(word_list)

@app.route('/api/topics/<topics_id>/media/<media_id>/words.csv', methods=['GET'])
@flask_login.login_required
def media_words_csv(topics_id, media_id):
    timespans_id = request.args.get('timespanId')
    word_list = _media_words(topics_id, media_id, timespans_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(word_list, props, 'media-'+str(media_id)+'-words')

@cache
def _media_words(topics_id, media_id, timespans_id):
    return mc.topicWordCount(topics_id, fq='media_id:'+media_id, timespans_id=timespans_id)

