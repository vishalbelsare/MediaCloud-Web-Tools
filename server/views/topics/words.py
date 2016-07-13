import logging
from flask import jsonify, request
import flask_login

from server import app, mc
import server.views.util.csv as csv

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/words', methods=['GET'])
#@flask_login.login_required
def topic_words(topic_id):
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    response = _topic_word_count(topic_id, snapshot_id, timespan_id)[:100]
    return jsonify(response)

@app.route('/api/topics/<topic_id>/words.csv', methods=['GET'])
#@flask_login.login_required
def topic_words_csv(topic_id):
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    response = _topic_word_count(topic_id, snapshot_id, timespan_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(response, props, 'sampled-words')

def _topic_word_count(topic_id, snapshot_id, timespan_id):
    response = mc.topicWordCount(topic_id, snapshot_id=snapshot_id, timespan_id=timespan_id)
    return response
