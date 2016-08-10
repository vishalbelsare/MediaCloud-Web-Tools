import logging
from flask import jsonify, request
import flask_login

from server import app, mc
import server.views.util.csv as csv
from server.cache import cache

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/words', methods=['GET'])
@flask_login.login_required
def topic_words(topic_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    response = _topic_word_count(topic_id, snapshots_id, timespans_id)[:100]
    return jsonify(response)

@app.route('/api/topics/<topic_id>/words.csv', methods=['GET'])
@flask_login.login_required
def topic_words_csv(topic_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    response = _topic_word_count(topic_id, snapshots_id, timespans_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(response, props, 'sampled-words')

@cache
def _topic_word_count(topic_id, snapshots_id, timespans_id):
    response = mc.topicWordCount(topic_id, snapshots_id=snapshots_id, timespans_id=timespans_id)
    return response
