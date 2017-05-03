# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login

from server import app, db, mc
from server.cache import cache
from server.util.request import form_fields_required, api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client


logger = logging.getLogger(__name__)
@app.route('/api/topics/preview/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_sentences_count():
    user_mc = user_mediacloud_client()
    solr_query = request.form['q']
    sentence_count_result = user_mc.sentenceList(solr_query=solr_query)
    # what is the fq filter - anything that we have?
    return jsonify(sentence_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/preview/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_count():
    user_mc = user_mediacloud_client()
    print "in story_count"
    solr_query = request.form['q']
    story_count_result = user_mc.storyCount(solr_query=solr_query)

    return jsonify(story_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/preview/stories/sample', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_sample():
    user_mc = user_mediacloud_client()
    print "in story_sample"
    solr_query = request.form['q']
    story_count_result = user_mc.storyList(solr_query=solr_query)

    return jsonify(story_count_result)  # give them back new data, so they can update the client


@app.route('/api/topics/preview/word/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_word_count():
    user_mc = user_mediacloud_client()
    solr_query = request.form['q']

    # TODO what is the right call here?
    story_sample_result = user_mc.wordCount(solr_query=solr_query)

    return jsonify(story_sample_result)  # give them back new data, so they can update the client



