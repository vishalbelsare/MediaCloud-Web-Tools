import logging, flask
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, mc
from server.views.topics import validated_sort
import server.views.util.csv as csv

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/media', methods=['GET'])
#@flask_login.login_required
def topic_media(topic_id):
    sort = validated_sort( request.args.get('sort') )
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    limit = request.args.get('limit')
    continuation_id = request.args.get('continuationId')
    media = mc.topicMediaList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort,
        limit=limit,continuation_id=continuation_id)
    return jsonify(media)

@app.route('/api/topics/<topic_id>/media.csv', methods=['GET'])
#@flask_login.login_required
def topic_media_csv(topic_id):
    sort = validated_sort( request.args.get('sort') )
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    all_media = []
    continuation_id = None
    more_media = True
    try:
        while more_media:
            page = mc.topicMediaList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort,
                limit=1000,continuation_id=continuation_id)
            page_media = page['media']
            if len(page_media) > 0:
                continuation_id = page['continuation_id']
                all_media = all_media + page_media
                more_media = True
            else:
                more_media = False
        props = ['media_id','name','url','story_count','inlink_count','outlink_count','bitly_click_count']
        return csv.stream_response(all_media,props,'media')
    except Exception as exception:
        return json.dumps({'error':str(exception)}, separators=(',',':')), 400
