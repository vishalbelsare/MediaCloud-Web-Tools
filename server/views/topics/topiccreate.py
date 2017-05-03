# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login

from server import app, db, mc
from server.cache import cache
from server.util.common import _media_ids_from_sources_param, _media_tag_ids_from_collections_param
from server.util.request import form_fields_required, arguments_required, api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name, is_user_logged_in
from server.views.topics.apicache import cached_topic_timespan_list
from server.views.topics import access_public_topic


logger = logging.getLogger(__name__)
@app.route('/api/topics/preview/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('solr_seed_query')
@api_error_handler
def api_topics_preview_sentences_count():
    user_mc = user_mediacloud_client()
    solr_seed_query = request.form['solr_seed_query']

    # TODO any optional args?
    optional_args = {
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
    }

    # parse out any sources and collections to add
    media_ids_to_add = _media_ids_from_sources_param(request.form['sources[]'])
    tag_ids_to_add = _media_tag_ids_from_collections_param(request.form['collections[]'])

    sentence_count_result = user_mc.sentenceList(name=name, description=description, solr_seed_query=solr_seed_query)
    # what is the fq filter - anything that we have?
    return jsonify(sentence_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/preview/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('solr_seed_query')
@api_error_handler
def api_topics_preview_story_count():
    user_mc = user_mediacloud_client()
    solr_seed_query = request.form['solr_seed_query']

    optional_args = {
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
        'ch_monitor_id': request.form['ch_monitor_id'] if len(request.form['ch_monitor_id']) > 0 and request.form['ch_monitor_id'] != 'null' else None,
        'max_iterations': request.form['max_iterations'] if 'max_iterations' in request.form else None,
        'twitter_topics_id': request.form['twitter_topics_id'] if 'twitter_topics_id' in request.form else None, 
    }

    # parse out any sources and collections to add
    media_ids_to_add = _media_ids_from_sources_param(request.form['sources[]'])
    tag_ids_to_add = _media_tag_ids_from_collections_param(request.form['collections[]'])

    story_count_result = user_mc.storyList(name=name, description=description, solr_seed_query=solr_seed_query)

    return jsonify(story_count_result)  # give them back new data, so they can update the client


@app.route('/api/topics/preview/stories/sample', methods=['POST'])
@flask_login.login_required
@form_fields_required('solr_seed_query')
@api_error_handler
def api_topics_preview_story_sample():
    user_mc = user_mediacloud_client()
    solr_seed_query = request.form['solr_seed_query']

    # TODO what is the right call here?
    story_sample_result = user_mc.storyList(name=name, description=description, solr_seed_query=solr_seed_query)

    return jsonify(story_sample_result)  # give them back new data, so they can update the client

