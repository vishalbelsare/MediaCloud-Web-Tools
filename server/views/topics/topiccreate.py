# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler
from server.util.common import _media_ids_from_sources_param, _media_tag_ids_from_collections_param
import datetime
# load the shared settings file

logger = logging.getLogger(__name__)

# TODO lets get a good set of helpers here then move out to a query/solr util
def concatenate_query_for_solr(args):
    query = ''
    query = args['solr_seed_query']

    if len(args['media_id']) > 0:
        query_media_id = " +".join(map(str, args['media_id']))
        query_media_id = " AND media_id:({})".format(query_media_id)
        query += query_media_id
    
    if len(args['tags_id']) > 0:
        query_tags_id = " +".join(map(str, args['tags_id']))
        query_tags_id = " AND tags_id_media:({})".format(query_tags_id)
        query += query_tags_id

    if 'start_date' in args:
        query += " " + concatenate_query_and_dates(args['start_date'], args['end_date'])
    
    return query

def concatenate_query_and_dates(start_date, end_date):
    publish_date = ''
    user_mc = user_mediacloud_client()
    publish_date += user_mc.publish_date_query(datetime.datetime.strptime(start_date, '%Y-%m-%d').date(),datetime.datetime.strptime(end_date, '%Y-%m-%d').date())

    return publish_date

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

    # TODO
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



