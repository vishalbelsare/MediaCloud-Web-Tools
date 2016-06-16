import logging, flask
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, mc
from server.views.topics import validated_sort
import server.views.util.csv as csv

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/top-stories', methods=['GET'])
#@flask_login.login_required
def api_topics_top_stories(topic_id):
    sort = validated_sort( request.args.get('sort') )
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    limit = request.args.get('limit')
    continuation_id = request.args.get('continuationId')
    stories = mc.topicStoryList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort,
        limit=limit,continuation_id=continuation_id)
    return jsonify(stories)

@app.route('/api/topics/<topic_id>/top-stories.csv', methods=['GET'])
#@flask_login.login_required
def topic_top_stories_csv(topic_id):
    sort = validated_sort( request.args.get('sort') )
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    all_stories = []
    continuation_id = None
    more_stories = True
    try:
        while more_stories:
            page = mc.topicStoryList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort,
                limit=1000,continuation_id=continuation_id)
            page_stories = page['stories']
            if len(page_stories) > 0:
                continuation_id = page['continuation_id']
                all_stories = all_stories + page_stories
                more_stories = True
            else:
                more_stories = False
        props = ['stories_id','publish_date','title','url','media_id','inlink_count','outlink_count','bitly_click_count']
        return csv.stream_response(all_stories,props,'stories')
    except Exception as exception:
        return json.dumps({'error':str(exception)}, separators=(',',':')), 400
