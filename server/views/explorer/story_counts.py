import logging
from flask import jsonify, request
import flask_login
import json
from operator import itemgetter

from server import app
import server.util.csv as csv
from server.util.request import api_error_handler
from server.views.explorer import parse_as_sample, parse_query_with_args_and_sample_search,\
    parse_query_with_keywords, load_sample_searches, file_name_for_download
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)


@app.route('/api/explorer/story/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_count():
    solr_q, solr_fq = parse_query_with_keywords(request.args)
    story_count_result = apicache.story_count(solr_q, solr_fq)
    return jsonify(story_count_result)  


@app.route('/api/explorer/demo/story/count', methods=['GET'])
@api_error_handler
def api_explorer_demo_story_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        current_search = sample_searches[search_id]['queries']
        solr_q, solr_fq = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)

    story_count_result = apicache.story_count(solr_q, solr_fq)
    # maybe check admin role before we run this?
    return jsonify(story_count_result)  # give them back new data, so they can update the client


@app.route('/api/explorer/stories/count.csv', methods=['POST'])
def explorer_story_count_csv():
    filename = u'story-count'
    story_count_results = []
    data = request.form
    if 'searchId' in data:
        # TODO: don't load this query twice because that is kind of dumb
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
        filename = filename  # don't have this info + current_query['q']
        sample_searches = load_sample_searches()
        query_object = sample_searches[data['searchId']]['queries'][data['index']]
        label = query_object['label']
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        label = query_object['label']
        filename = file_name_for_download(label, filename)
    # sentence count needs dates to be sent explicitly -TODO check what has priority
    story_count = apicache.story_count(solr_q, solr_fq)
    story_count_results.append({'query': label, 'count': story_count['count']})
    props = ['query', 'count']
    return csv.stream_response(story_count_results, props, filename)


@app.route('/api/explorer/demo/stories/split-count', methods=['GET'])
# handles search id query or keyword query
@api_error_handler
def api_explorer_demo_story_split_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    index = int(request.args['index']) if 'index' in request.args else None

    if isinstance(search_id, int) and search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)
    # why is this call fundamentally different than the cache call???
    results = apicache.story_split_count(solr_q, solr_fq)

    return jsonify(results)


@app.route('/api/explorer/stories/split-count.csv', methods=['POST'])
@api_error_handler
def api_explorer_story_split_count_csv():
    filename = u'stories-over-time'
    data = request.form
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
        filename = filename  # don't have this info + current_query['q']
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
    results = apicache.story_split_count(solr_q, solr_fq)
    results = sorted(results, key=itemgetter('date'))
    results = [{'date': item['date'], 'stories': item['count']} for item in results]
    props = ['date', 'stories']
    return csv.stream_response(results, props, filename)
