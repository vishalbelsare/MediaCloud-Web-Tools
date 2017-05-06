# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
from server.util.common import _media_ids_from_sources_param, _media_tag_ids_from_collections_param

# load the shared settings file

logger = logging.getLogger(__name__)

# TODO lets get a good set of helpers here then move out to a query/solr util
def concatenate_query_for_solr(args):
    query = ''
    item = ''
    # TODO do that {}.{} thing 
    for q in args.keys():
        q_val = args[q]
        item = q.join(":").join(q_val)
        query += item

def concatenate_publish_date_for_solr(start_date, end_date):
    date_range = start_date + end_date

@app.route('/api/topics/create/preview/sentences/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_sentences_count():
    user_mc = user_mediacloud_client()
    solr_query = ''

    args = {
        'solr_seed_query': request.form['q'],
        'media_ids': _media_ids_from_sources_param(request.form['sources[]']),
        'tag_ids': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }

    solr_query = concatenate_query_for_solr(args);

    sentence_count_result = user_mc.sentenceCount(solr_query=solr_query, start_date=request.form['start_date'], end_date=request.form['end_date'], split=True)
    return jsonify(sentence_count_result)  # give them back new data, so they can update the client

@app.route('/api/topics/create/preview/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_count():
    user_mc = user_mediacloud_client()
    solr_query = request.form['q']

    # TODO
    args = {
        'solr_seed_query': request.form['q'],
        'media_ids': _media_ids_from_sources_param(request.form['sources[]']),
        'tag_ids': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }
    # concatenate_publish_date_for_solr(request.form['start_date'], request.form['end_date'])

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
    solr_query = request.form['q']

    # TODO
    args = {
        'solr_seed_query': request.form['q'],
        'media_ids': _media_ids_from_sources_param(request.form['sources[]']),
        'tag_ids': _media_tag_ids_from_collections_param(request.form['collections[]'])
    }
    # concatenate_publish_date_for_solr(request.form['start_date'], request.form['end_date'])

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



