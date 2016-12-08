import logging
from flask import request, jsonify
import flask_login

from server import app
import server.util.csv as csv
from server.util.request import api_error_handler
from server.auth import user_mediacloud_key
from server.views.topics.sentences import stream_sentence_count_csv
from server.views.topics.stories import stream_story_list_csv
from server.views.topics.apicache import topic_word_counts, topic_story_list, topic_sentence_counts #, topic_media_list

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/words/<word>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word(topics_id, word):
    response = topic_word_counts(user_mediacloud_key(), topics_id, q=word)[:1]
    logger.info(response)
    return jsonify(response)

@app.route('/api/topics/<topics_id>/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_words(topics_id):
    results = topic_word_counts(user_mediacloud_key(), topics_id)[:200]
    totals = [] # important so that these get reset on the client when they aren't requested
    logger.info(request.args)
    if ('withTotals' in request.args) and (request.args['withTotals'] == "true"):
        # handle requests to return these results
        # and also data to compare it to for the whole topic focus
        totals = topic_word_counts(user_mediacloud_key(), topics_id, timespans_id=None, q=None)
    response = {
        'list': results,
        'totals': totals
    }
    return jsonify(response)

@app.route('/api/topics/<topics_id>/words.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_words_csv(topics_id):
    response = topic_word_counts(user_mediacloud_key(), topics_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(response, props, 'sampled-words')

@app.route('/api/topics/<topics_id>/words/<word>/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_sentence_counts(topics_id, word):
    return jsonify(topic_sentence_counts(user_mediacloud_key(), topics_id, q=word))

@app.route('/api/topics/<topics_id>/words/<word>/sentences/count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_sentence_counts_csv(topics_id, word):
    return stream_sentence_count_csv(user_mediacloud_key(), 'word-'+word+'-sentence-counts',
        topics_id, q=word)

@app.route('/api/topics/<topics_id>/words/<word>/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_stories(topics_id, word):
    response = topic_story_list(user_mediacloud_key(), topics_id, q=word)
    return jsonify(response)

@app.route('/api/topics/<topics_id>/words/<word>/stories.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_stories_csv(topics_id, word):
    return stream_story_list_csv(user_mediacloud_key(), 'word-'+word+'-stories', topics_id)

@app.route('/api/topics/<topics_id>/words/<word>/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_associated_words(topics_id, word):
    response = topic_word_counts(user_mediacloud_key(), topics_id, q=word)[:100]
    return jsonify(response)

@app.route('/api/topics/<topics_id>/words/<word>/words.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_associated_words_csv(topics_id, word):
    response = topic_word_counts(user_mediacloud_key(), topics_id, q=word)
    props = ['term', 'stem', 'count']
    return csv.stream_response(response, props, 'word-'+word+'-sampled-words')

# Can't do this yet because topics/media/list doesn't support q as a parameter :-(
'''
@app.route('/api/topics/<topics_id>/words/<word>/media', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_media(topics_id, word):
    response = topic_media_list(user_mediacloud_key(), topics_id, q=word)
    return jsonify(response)
'''
