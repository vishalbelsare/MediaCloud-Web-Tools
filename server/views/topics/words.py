import logging
from flask import request, jsonify
import flask_login
from server import app, TOOL_API_KEY
import server.util.csv as csv
from server.util.request import api_error_handler
from server.auth import user_mediacloud_key, is_user_logged_in
from server.views.topics.sentences import stream_sentence_count_csv
from server.views.topics.stories import stream_story_list_csv
from server.views.topics.apicache import topic_word_counts, topic_story_list, topic_sentence_counts, topic_sentence_sample #, topic_media_list
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)

WORD_CONTEXT_SIZE = 5   # for sentence fragments, this is the amount of words before & after that we return


@app.route('/api/topics/<topics_id>/words/<word>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word(topics_id, word):
    response = topic_word_counts(user_mediacloud_key(), topics_id, q=word)[:1]
    logger.info(response)
    return jsonify(response)


@app.route('/api/topics/<topics_id>/words', methods=['GET'])
@api_error_handler
def topic_words(topics_id):

    if access_public_topic(topics_id):
        results = topic_word_counts(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None, foci_id=None, q=None)
    elif is_user_logged_in():
        results = topic_word_counts(user_mediacloud_key(), topics_id)[:200]
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})

    totals = []  # important so that these get reset on the client when they aren't requested
    logger.info(request.args)
    if (is_user_logged_in()) and ('withTotals' in request.args) and (request.args['withTotals'] == "true"):
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


@app.route('/api/topics/<topics_id>/words/<word>/sample-usage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_usage_sample(topics_id, word):
    # gotta respect the manual query if there is one
    q = request.args['q'] if 'q' in request.args else None
    if (q is not None) and (len(q) > 0):
        q = u"({}) AND ({})".format(word, q)
    else:
        q = word
    # need to use tool API key here because non-admin users can't pull sentences
    results = topic_sentence_sample(TOOL_API_KEY, topics_id, sample_size=1000, q=q)
    # TODO: only pull the 5 words before and after so we
    fragments = [_sentence_fragment_around(word, s['sentence']) for s in results['response']['docs'] if s['sentence'] is not None]
    fragments = [f for f in fragments if f is not None]
    return jsonify({'fragments': fragments})


def _sentence_fragment_around(keyword, sentence):
    '''
    Turn a sentence into a sentence fragment, including just the 5 words before and after the keyword we are looking at.
    We do this to enforce our rule that full sentences (even without metadata) never leave our servers).
    Warning: this makes simplistic assumptions about word tokenization
    ::return:: a sentence fragment around keyword, or None if keyword can't be found
    '''
    try:
        words = sentence.split()  # super naive, but works ok
        keyword_index = None
        for index, word in enumerate(words):
            if keyword_index is not None:
                continue
            if word.lower().startswith(keyword.replace("*", "").lower()):
                keyword_index = index
        if keyword_index is None:
            return None
        min_word_index = max(0, keyword_index - WORD_CONTEXT_SIZE)
        max_word_index = min(len(words), keyword_index + WORD_CONTEXT_SIZE)
        fragment_words = words[min_word_index:max_word_index]
        return " ".join(fragment_words)
    except ValueError:
        return None


# Can't do this yet because topics/media/list doesn't support q as a parameter :-(
'''
@app.route('/api/topics/<topics_id>/words/<word>/media', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_word_media(topics_id, word):
    response = topic_media_list(user_mediacloud_key(), topics_id, q=word)
    return jsonify(response)
'''
