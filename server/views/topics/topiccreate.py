# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
from server.util.common import _media_ids_from_sources_param, _media_tag_ids_from_collections_param
from server.views.topics import concatenate_query_for_solr 

# load the shared settings file

logger = logging.getLogger(__name__)

@app.route('/api/topics/create/preview/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_sentences_count():
    user_mc = user_mediacloud_client()
    solr_query = ''

    args = {
        'solr_seed_query': request.form['q'],
        'media_id': _media_ids_from_sources_param(request.form['sources[]']),
        'tags_id': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }

    solr_query = concatenate_query_for_solr(args);

    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, split_start_date=request.form['start_date'], split_end_date=request.form['end_date'], split=True)
    return jsonify(sentence_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/create/preview/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_count():
    user_mc = user_mediacloud_client()

    # TODO
    args = {
        'solr_seed_query': request.form['q'],
        'start_date': request.form['start_date'],
        'end_date': request.form['end_date'],
        'media_id': _media_ids_from_sources_param(request.form['sources[]']),
        'tags_id': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }
    solr_query = concatenate_query_for_solr(args);
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

    args = {
        'solr_seed_query': request.form['q'],
        'start_date': request.form['start_date'],
        'end_date': request.form['end_date'],
        'media_id': _media_ids_from_sources_param(request.form['sources[]']),
        'tags_id': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }
    
    solr_query = concatenate_query_for_solr(args);
    story_count_result = user_mc.storyList(solr_query=solr_query)

    return jsonify(story_count_result)  # give them back new data, so they can update the client


@app.route('/api/topics/create/preview/words/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_word_count():
    user_mc = user_mediacloud_client()

    args = {
        'solr_seed_query': request.form['q'],
        'start_date': request.form['start_date'],
        'end_date': request.form['end_date'],
        'media_id': _media_ids_from_sources_param(request.form['sources[]']),
        'tags_id': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }
    
    solr_query = concatenate_query_for_solr(args);
    word_count_result = user_mc.wordCount(solr_query=solr_query)

    return jsonify(word_count_result)  # give them back new data, so they can update the client



