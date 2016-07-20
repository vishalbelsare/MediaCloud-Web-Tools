import logging
import json
from flask import jsonify, request
import flask_login

from server import app, mc
from server.views.topics import validated_sort
import server.views.util.csv as csv

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/media/<media_id>', methods=['GET'])
#@flask_login.login_required
def media(topic_id, media_id):
    media_info = mc.media(media_id) # TODO: replace with topic media call
    return jsonify(media_info)

@app.route('/api/topics/<topic_id>/media', methods=['GET'])
#@flask_login.login_required
def topic_media(topic_id):
    sort = validated_sort(request.args.get('sort'))
    snapshot_id = request.args.get('snapshotId')
    timespan_id = request.args.get('timespanId')
    limit = request.args.get('limit')
    link_id = request.args.get('linkId')
    media_list = mc.topicMediaList(topic_id, snapshot_id=snapshot_id, timespan_id=timespan_id, sort=sort,
        limit=limit, link_id=link_id)
    return jsonify(media_list)

@app.route('/api/topics/<topic_id>/media.csv', methods=['GET'])
#@flask_login.login_required
def topic_media_csv(topic_id):
    sort = validated_sort(request.args.get('sort'))
    snapshot_id = request.args.get('snapshotId')
    timespan_id = request.args.get('timespanId')
    all_media = []
    link_id = None
    more_media = True
    try:
        while more_media:
            page = mc.topicMediaList(topic_id, snapshot_id=snapshot_id, timespan_id=timespan_id, sort=sort,
                limit=1000, link_id=link_id)
            page_media = page['media']
            if len(page_media) > 0:
                link_id = page['links']['next']
                all_media = all_media + page_media
                more_media = True
            else:
                more_media = False
        props = ['media_id', 'name', 'url', 'story_count', 'inlink_count', 'outlink_count', 'bitly_click_count']
        return csv.stream_response(all_media, props, 'media')
    except Exception as exception:
        return json.dumps({'error':str(exception)}, separators=(',', ':')), 400
