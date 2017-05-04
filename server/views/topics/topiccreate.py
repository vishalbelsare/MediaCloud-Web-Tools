# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
# load the shared settings file

logger = logging.getLogger(__name__)

@app.route('/api/topics/create/preview/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_sentences_count():
    user_mc = user_mediacloud_client()
    solr_query = request.form['q']
    sentence_count_result = user_mc.sentenceList(solr_query=solr_query)['response']
    return jsonify(sentence_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/create/preview/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_count():
    user_mc = user_mediacloud_client()
    solr_query = request.form['q']
    story_count_result = user_mc.storyCount(solr_query=solr_query)
    # do some evaluation here where we look at the admin role and determine max
    # for admin, they can have > 100K seed stories.
    return jsonify(story_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/create/preview/stories/sample', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_sample():
    user_mc = user_mediacloud_client()
    print "in story_sample"
    solr_query = request.form['q']
    story_count_result = user_mc.storyList(solr_query=solr_query)

    return jsonify(story_count_result)  # give them back new data, so they can update the client


@app.route('/api/topics/create/preview/word/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_word_count():
    user_mc = user_mediacloud_client()
    solr_query = request.form['q']

    # TODO what is the right call here?
    story_sample_result = user_mc.wordCount(solr_query=solr_query)

    return jsonify(story_sample_result)  # give them back new data, so they can update the client



