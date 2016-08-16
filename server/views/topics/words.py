import logging
from flask import jsonify, request
import flask_login

from server import app, mc
import server.util.csv as csv
from server.cache import cache
from server.util.request import filters_from_args

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/words', methods=['GET'])
@flask_login.login_required
def topic_words(topic_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    response = _topic_word_count(topic_id,
        snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id)[:100]
    return jsonify(response)

@app.route('/api/topics/<topic_id>/words.csv', methods=['GET'])
@flask_login.login_required
def topic_words_csv(topic_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    response = _topic_word_count(topic_id, snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(response, props, 'sampled-words')

@cache
def _topic_word_count(topic_id, **kwargs):
    response = mc.topicWordCount(topic_id, **kwargs)
    return response
