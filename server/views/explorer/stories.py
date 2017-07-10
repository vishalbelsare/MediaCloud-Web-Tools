# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.cache import cache
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.views.explorer import concatenate_query_for_solr, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
# load the shared settings file

logger = logging.getLogger(__name__)

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

@app.route('/api/explorer/stories.csv', methods=['GET'])
@flask_login.login_required
def explorer_stories_csv(query):
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)

    story_count_result = cached_story_samples(solr_query)
    return stream_story_samples_csv('explorer-stories', story_count_result)

def stream_story_samples_csv(filename, stories):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    props = ['stories_id', 'publish_date',
            'title', 'url', 'media_id', 'media_name',
            'bitly_click_count', 'facebook_share_count']
    return csv.stream_response(stories, props, filename)


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
        # TODO what about other params: date etc for demo..

    story_count_result = cached_story_count(solr_query)
    # maybe check admin role before we run this?
    return jsonify(story_count_result)  # give them back new data, so they can update the client


@cache
def cached_story_count(query):
    return mc.storyCount(solr_query=query)

