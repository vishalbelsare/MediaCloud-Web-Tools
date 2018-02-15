# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, mc
from server.cache import cache
import server.util.csv as csv
from server.util.request import api_error_handler
from server.views.explorer import prep_simple_solr_query, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import json
# load the shared settings file

logger = logging.getLogger(__name__)

@app.route('/api/explorer/stories/sample', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_sample():
    solr_query = parse_query_with_keywords(request.args)
 
    story_count_result = cached_random_stories(solr_query)
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
 
    story_count_result = cached_random_stories(solr_query)
    return jsonify(story_count_result)  


@cache.cache_on_arguments()
def cached_random_stories(query):
    return mc.storyList(solr_query=query, sort=mc.SORT_RANDOM)


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

    story_count_result = cached_random_stories(solr_query)
    
    return stream_story_samples_csv(filename, story_count_result)

def stream_story_samples_csv(filename, stories):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    props = ['stories_id', 'publish_date',
            'title', 'url', 'media_name','media_id', 'language']
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


@cache.cache_on_arguments()
def cached_story_count(query):
    return mc.storyCount(solr_query=query)


def stream_story_count_csv(fn, search_id_or_query_list):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    # if we have a search id, we load the samples from our sample searches file
    filename = ''
    story_count_results = []
    SAMPLE_SEARCHES = load_sample_searches()
    try:
        search_id = int(search_id_or_query_list)
        if search_id >= 0:
            SAMPLE_SEARCHES = load_sample_searches()

            sample_queries = SAMPLE_SEARCHES[search_id]['queries']

            for query in sample_queries:
                solr_query = prep_simple_solr_query(query)
                storyCount = cached_story_count(solr_query)
                query_and_story_count = {'query' : query['label'], 'count': storyCount['count']}
                story_count_results.append(query_and_story_count)

    except Exception as e:
        custom_queries = json.loads(search_id_or_query_list)

        for query in custom_queries:
            solr_query = parse_query_with_keywords(query)
            filename = fn + query['q']

            storyCount = cached_story_count(solr_query)
            query_and_story_count = {'query' : query['label'], 'count': storyCount['count']}
            story_count_results.append(query_and_story_count)
    
    props = ['query','count']
    return csv.stream_response(story_count_results, props, filename)


@app.route('/api/explorer/stories/count.csv/<search_id_or_query_list>', methods=['GET'])
def explorer_story_count_csv(search_id_or_query_list):
    return stream_story_count_csv('explorer-stories-', search_id_or_query_list)

