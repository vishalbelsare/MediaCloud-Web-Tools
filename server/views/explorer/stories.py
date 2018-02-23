import logging
from flask import jsonify, request, Response
import flask_login
import json
from mediacloud.api import MediaCloud

from server import app, mc
from server.cache import cache, key_generator
import server.util.csv as csv
from server.util.request import api_error_handler
from server.views.explorer import prep_simple_solr_query, parse_as_sample, parse_query_with_args_and_sample_search,\
    parse_query_with_keywords, load_sample_searches

logger = logging.getLogger(__name__)


@app.route('/api/explorer/stories/sample', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_sample():
    solr_query = parse_query_with_keywords(request.args)
 
    story_sample_result = cached_random_stories(solr_query)
    return jsonify(story_sample_result)  


@app.route('/api/explorer/demo/stories/sample', methods=['GET'])
@api_error_handler
def api_explorer_demo_story_sample():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        current_search = sample_searches[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)
 
    story_sample_result = cached_random_stories(solr_query)
    return jsonify(story_sample_result)  


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_random_stories(query):
    return mc.storyList(solr_query=query, sort=mc.SORT_RANDOM)


# if this is a sample search, we will have a search id and a query index
# if this is a custom search, we will have a query will q,start_date, end_date, sources and collections
@app.route('/api/explorer/stories/samples.csv/<search_id_or_query>/<index>', methods=['GET'])
def explorer_stories_csv(search_id_or_query, index=None):
    filename = u'explorer-stories-'
    try:
        search_id = int(search_id_or_query)
        if search_id >= 0:  # this is a sample query
            solr_query = parse_as_sample(search_id, index)
            # TODO 
            filename = filename  # don't have this info + current_query['q']
        # for demo users we only download 100 random stories (ie. not all matching stories)
        return _stream_story_list_csv(filename, solr_query, 100, MediaCloud.SORT_RANDOM, 1)
    except ValueError:
        # planned exception if search_id is actually a keyword or query
        # csv downloads are 1:1 - one query to one download, so we can use index of 0
        query_or_keyword = search_id_or_query
        current_query = json.loads(query_or_keyword)[0]
        solr_query = parse_query_with_keywords(current_query)  # TODO don't mod the start and end date unless permissions
        # now page through all the stories and download them
        return _stream_story_list_csv(filename, solr_query)


def _stream_story_list_csv(filename, query, stories_per_page=1000, sort=MediaCloud.SORT_PROCESSED_STORIES_ID,
                           page_limit=None):
    props = ['stories_id', 'publish_date', 'title', 'url', 'language', 'ap_syndicated',
             'story_date_guess_method', 'story_extractor_version', 'story_geocoder_version', 'story_nyt_themes_version',
             'media_id', 'media_name', 'media_url',
             'media_pub_country', 'media_pub_state', 'media_language', 'media_about_country',
             'media_media_type']
    timestamped_filename = csv.safe_filename(filename)
    headers = {
        "Content-Disposition": "attachment;filename=" + timestamped_filename
    }
    return Response(_story_list_by_page_as_csv_row(query, stories_per_page, sort, page_limit, props),
                    mimetype='text/csv; charset=utf-8', headers=headers)


# generator you can use to handle a long list of stories row by row (one row per story)
def _story_list_by_page_as_csv_row(query, stories_per_page, sort, page_limit, props):
    yield u','.join(props) + u'\n'  # first send the column names
    for page in _story_list_by_page(query, stories_per_page, sort, page_limit):
        for story in page:
            cleaned_row = csv.dict2row(props, story)
            row_string = u','.join(cleaned_row) + u'\n'
            yield row_string


# generator you can use to do something for each page of story results
def _story_list_by_page(query, stories_per_page, sort, page_limit=None):
    last_processed_stories_id = 0  # download oldest first
    page_count = 0
    media_cache = {}  # media_id => media object
    while True:
        if (page_limit is not None) and (page_limit >= page_limit):
            break
        story_page = _cached_story_list_page(query, last_processed_stories_id, stories_per_page, sort)
        for s in story_page:
            # add in media metadata to the story (from lazy cache)
            media_id = s['media_id']
            if media_id not in media_cache:
                media = _cached_media(media_id)
                media_cache[media_id] = media
            media = media_cache[media_id]
            for k, v in media['metadata'].iteritems():
                s[u'media_{}'.format(k)] = v['label'] if v is not None else None
            # and add in the story metadata too
            for k, v in s['metadata'].iteritems():
                s[u'story_{}'.format(k)] = v['tag'] if v is not None else None
        yield story_page
        if len(story_page) < stories_per_page:  # this is the last page so bail out
            break
        last_processed_stories_id = story_page[-1]['processed_stories_id']
        page_count += 1


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_media(media_id):
    # ok to be a cross-user cache here because there aren't permissions associated
    return mc.media(media_id)


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_story_list_page(query, last_processed_stories_id, stories_per_page, sort):
    # be user-specific in this cache to be careful about permissions on stories
    return mc.storyList(query, last_processed_stories_id=last_processed_stories_id, rows=stories_per_page, sort=sort)


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


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_story_count(query):
    return mc.storyCount(solr_query=query)


def stream_story_count_csv(fn, search_id_or_query_list):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    # if we have a search id, we load the samples from our sample searches file
    filename = fn
    story_count_results = []
    try:
        search_id = int(search_id_or_query_list)
        if search_id >= 0:
            sample_searches = load_sample_searches()

            sample_queries = sample_searches[search_id]['queries']

            for query in sample_queries:
                solr_query = prep_simple_solr_query(query)
                story_count = cached_story_count(solr_query)
                query_and_story_count = {'query' : query['label'], 'count': story_count['count']}
                story_count_results.append(query_and_story_count)

    except ValueError:
        custom_queries = json.loads(search_id_or_query_list)

        for query in custom_queries:
            solr_query = parse_query_with_keywords(query)
            filename = fn + query['q']

            story_count = cached_story_count(solr_query)
            query_and_story_count = {'query' : query['label'], 'count': story_count['count']}
            story_count_results.append(query_and_story_count)
    
    props = ['query', 'count']
    return csv.stream_response(story_count_results, props, filename)


@app.route('/api/explorer/stories/count.csv/<search_id_or_query_list>', methods=['GET'])
def explorer_story_count_csv(search_id_or_query_list):
    return stream_story_count_csv('explorer-story-count-', search_id_or_query_list)

