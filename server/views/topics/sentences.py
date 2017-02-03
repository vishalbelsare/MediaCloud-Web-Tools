import logging
from operator import itemgetter
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
import server.util.csv as csv
from server.util.request import filters_from_args, api_error_handler, json_error_response
from server.auth import user_mediacloud_key, user_mediacloud_client, is_user_logged_in
from server.views.topics.apicache import topic_sentence_counts, topic_focal_sets, cached_topic_timespan_list
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/sentences/count', methods=['GET'])
@api_error_handler
def topic_sentence_count(topics_id):
    if access_public_topic(topics_id):
        response = topic_sentence_counts(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None, foci_id=None,q=None)
    elif is_user_logged_in():
        response = topic_sentence_counts(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status':'Error', 'message': 'Invalid attempt'})

    return jsonify(response)

@app.route('/api/topics/<topics_id>/sentences/count.csv', methods=['GET'])
@flask_login.login_required
def topic_sentence_count_csv(topics_id):
    return stream_sentence_count_csv(user_mediacloud_key(), 'sentence-counts', topics_id)

def stream_sentence_count_csv(user_mc_key, filename, topics_id, **kwargs):
    results = topic_sentence_counts(user_mc_key, topics_id, **kwargs)
    clean_results = [{'date': date, 'numFound': count} for date, count in results['split'].iteritems() if date not in ['gap', 'start', 'end']]
    sorted_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'numFound']
    return csv.stream_response(sorted_results, props, filename)

@app.route('/api/topics/<topics_id>/sentences/focal-set/<focal_sets_id>/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_focal_set_sentences_compare(topics_id, focal_sets_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    all_focal_sets = topic_focal_sets(user_mediacloud_key(), topics_id, snapshots_id)
    # need the timespan info, to find the appropriate timespan with each focus
    base_snapshot_timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id)
    # logger.info(base_snapshot_timespans)
    base_timespan = None
    for t in base_snapshot_timespans:
        if int(t['timespans_id']) == int(timespans_id):
            base_timespan = t
            logger.info('base timespan = %s', timespans_id)
    if base_timespan is None:
        return json_error_response('Couldn\'t find the timespan you specified')
    # iterate through to find the one of interest
    focal_set = None
    for fs in all_focal_sets:
        if int(fs['focal_sets_id']) == int(focal_sets_id):
            focal_set = fs
    if focal_set is None:
        return json_error_response('Invalid Focal Set Id')
    # collect the sentence counts for each foci
    for focus in focal_set['foci']:
        # find the matching timespan within this focus
        snapshot_timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id, foci_id=focus['foci_id'])
        timespan = None
        for t in snapshot_timespans:
            if t['start_date'] == base_timespan['start_date'] and t['end_date'] == base_timespan['end_date'] and t['period'] == base_timespan['period']:
                timespan = t
                logger.info('matching in focus %s, timespan = %s', focus['foci_id'], t['timespans_id'])
        if timespan is None:
            return json_error_response('Couldn\'t find a matching timespan in the '+focus.name+' focus')
        data = topic_sentence_counts(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id, timespans_id=timespan['timespans_id'], foci_id=focus['foci_id'])
        focus['sentence_counts'] = data
    return jsonify(focal_set)
