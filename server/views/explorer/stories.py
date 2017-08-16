# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.cache import cache
import server.util.csv as csv
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.views.explorer import concatenate_query_for_solr, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
import json
# load the shared settings file

logger = logging.getLogger(__name__)

@app.route('/api/explorer/stories/sample', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_sample():
    solr_query = parse_query_with_keywords(request.args)
 
    story_count_result = cached_story_samples(solr_query)
    return jsonify(story_count_result)  


@app.route('/api/explorer/demo/stories/sample', methods=['GET'])
@api_error_handler
def api_explorer_demo_story_sample():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)
 
    story_count_result = cached_story_samples(solr_query)
    return jsonify(story_count_result)  

@cache
def cached_story_samples(query):
    return mc.storyList(solr_query=query)


@app.route('/api/explorer/stories/samples.csv/<search_id_or_query>/<index>', methods=['GET'])
def explorer_stories_csv(search_id_or_query, index):
    filename = ''
    SAMPLE_SEARCHES = load_sample_searches()
    try:
        search_id = int(search_id_or_query)
        if search_id >= 0:
            SAMPLE_SEARCHES = load_sample_searches()
            current_search = SAMPLE_SEARCHES[search_id]['queries']
            solr_query = parse_query_with_args_and_sample_search(search_id, current_search)

            if int(index) < len(current_search): 
                start_date = current_search[int(index)]['startDate']
                end_date = current_search[int(index)]['endDate']
            filename = 'explorer-stories-' + current_search[int(index)]['q']
    except Exception as e:
        # so far, we will only be fielding one keyword csv query at a time, so we can use index of 0
        query = json.loads(search_id_or_query)
        current_query = query[0]
        solr_query = parse_query_with_keywords(current_query)
        filename = 'explorer-stories-' + current_query['q']

    story_count_result = cached_story_samples(solr_query)
    
    return stream_story_samples_csv(filename, story_count_result)

def stream_story_samples_csv(filename, stories):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    props = ['stories_id', 'publish_date',
            'title', 'media_name']
    return csv.stream_response(stories, props, filename)

@app.route('/api/explorer/story/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_count():
    solr_query = parse_query_with_keywords(request.args)
 
    story_count_result = cached_story_count(solr_query)
    return jsonify(story_count_result)  


@app.route('/api/explorer/demo/story/count', methods=['GET'])
@api_error_handler
def api_explorer_demo_story_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)

    story_count_result = cached_story_count(solr_query)
    # maybe check admin role before we run this?
    return jsonify(story_count_result)  # give them back new data, so they can update the client


@cache
def cached_story_count(query):
    return mc.storyCount(solr_query=query)

def stream_story_count_csv(fn, search_id_or_query, index):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    filename = ''
    SAMPLE_SEARCHES = load_sample_searches()
    try:
        search_id = int(search_id_or_query)
        if search_id >= 0:
            SAMPLE_SEARCHES = load_sample_searches()
            current_search = SAMPLE_SEARCHES[search_id]['queries']
            solr_query = parse_query_with_args_and_sample_search(search_id, current_search)

            if int(index) < len(current_search): 
                start_date = current_search[int(index)]['startDate']
                end_date = current_search[int(index)]['endDate']
                filename = fn + current_search[int(index)]['q']

    except Exception as e:
        # so far, we will only be fielding one keyword csv query at a time, so we can use index of 0
        query = json.loads(search_id_or_query)
        current_query = query[0]
        solr_query = parse_query_with_keywords(current_query)
        filename = fn + current_query['q']

    story_count_result = cached_story_count(solr_query)
    props = ['count']
    return csv.stream_response(story_count_result, props, filename)

@app.route('/api/explorer/stories/count.csv/<search_id_or_query>/<index>', methods=['GET'])
def explorer_story_count_csv(search_id_or_query, index):


    return stream_story_count_csv('explorer-stories-', search_id_or_query, index)

