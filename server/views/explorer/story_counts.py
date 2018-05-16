import logging
from flask import jsonify, request
import flask_login
import json
from operator import itemgetter

from server import app, TOOL_API_KEY
from server.auth import user_mediacloud_key, is_user_logged_in
import server.util.csv as csv
from server.util.request import api_error_handler
from server.views.explorer import parse_as_sample, parse_query_with_args_and_sample_search,\
    parse_query_with_keywords, load_sample_searches, file_name_for_download, concatenate_query_for_solr
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)


@app.route('/api/explorer/stories/count.csv', methods=['POST'])
def explorer_story_count_csv():
    filename = u'story-count'
    story_count_results = []
    data = request.form
    api_key = user_mediacloud_key() if is_user_logged_in() else TOOL_API_KEY
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

    solr_open_query = concatenate_query_for_solr(solr_seed_query='*',
                                                 media_ids=request.args['sources'],
                                                 tags_ids=request.args['collections'])
    story_count = apicache.normalized_and_story_split_count(api_key, solr_q, solr_fq, solr_open_query)
    story_count_results.append({'query': label, 'count': story_count['count']})
    props = ['query', 'count', 'total_counts']
    return csv.stream_response(story_count_results, props, filename)


@app.route('/api/explorer/stories/split-count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_split_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    index = int(request.args['index']) if 'index' in request.args else None

    if isinstance(search_id, int) and search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)
    # why is this call fundamentally different than the cache call???
    solr_open_query = concatenate_query_for_solr(solr_seed_query='*',
                                                 media_ids=request.args['sources'],
                                                 tags_ids=request.args['collections'])
    results = apicache.normalized_and_story_split_count(user_mediacloud_key(), solr_q, solr_fq, solr_open_query)

    return jsonify({'results': results})


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
    solr_open_query = concatenate_query_for_solr(solr_seed_query='*',
                                                 media_ids=request.args['sources'],
                                                 tags_ids=request.args['collections'])
    results = apicache.normalized_and_story_split_count(user_mediacloud_key(), solr_q, solr_fq, solr_open_query)

    return jsonify({'results': results})


@app.route('/api/explorer/stories/split-count.csv', methods=['POST'])
@api_error_handler
def api_explorer_story_split_count_csv():
    filename = u'stories-over-time'
    data = request.form
    solr_open_query = data
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
        filename = filename  # don't have this info + current_query['q']
        # TODO solr_open_query
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
        solr_open_query = query_object
        solr_open_query['q']='*'

    results = apicache.normalized_and_story_split_count(user_mediacloud_key(), solr_q, solr_fq, solr_open_query)

    results_regular = sorted(results['with_keywords']['counts'], key=itemgetter('date'))
    results_open = sorted(results['without_keywords']['counts'], key=itemgetter('date'))
    results = [{'date': item['date'], 'story_count_keyword': item['count']} for item in results_regular]
    results_no_keyword = [{'date': item['date'], 'story_count_without_keyword': item['count']} for item in results_regular]
    results += results_no_keyword #TODO should merge thiese actually
    props = ['date', 'story_count_keyword', 'story_count_without_keyword']
    return csv.stream_response(results, props, filename)
