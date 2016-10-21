import logging
from flask import jsonify, request
import flask_login

from server import app
import server.util.csv as csv
from server.cache import cache
from server.util.request import filters_from_args, api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.sentences import split_sentence_count
from server.views.topics.stories import topic_story_list

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_words(topic_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    response = _topic_word_count(user_mediacloud_key(), topic_id,
        snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id)[:100]
    return jsonify(response)

@app.route('/api/topics/<topic_id>/words.csv', methods=['GET'])
@flask_login.login_required
def topic_words_csv(topic_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    response = _topic_word_count(user_mediacloud_key(), topic_id, snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(response, props, 'sampled-words')

@cache
def _topic_word_count(user_mc_key, topic_id, **kwargs):
    user_mc = user_mediacloud_client()
    response = user_mc.topicWordCount(topic_id, **kwargs)
    return response

@app.route('/api/topics/<topic_id>/words/<word>/attention', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_attention(topic_id, word):
    response = split_sentence_count(user_mediacloud_key(), topic_id, q=word)
    return jsonify(response)

@app.route('/api/topics/<topic_id>/words/<word>/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_stories(topic_id, word):
    response = topic_story_list(user_mediacloud_key(), topic_id, q=word)
    return jsonify(response)
