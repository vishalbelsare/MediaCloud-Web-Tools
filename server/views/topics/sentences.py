import logging
from flask import jsonify, request
import flask_login

from server import app
import server.util.csv as csv
from server.cache import cache
from server.util.request import filters_from_args, api_error_handler, json_error_response, arguments_required
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.focalsets import focal_set_list

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_sentence_count(topics_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    response = split_sentence_count(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id)
    return jsonify(response)

@app.route('/api/topics/<topics_id>/sentences/count.csv', methods=['GET'])
@flask_login.login_required
def topic_sentence_count_csv(topics_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    return stream_sentence_count_csv(user_mediacloud_key(), 'sentence-counts', topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id)

@cache
def split_sentence_count(user_mc_key, topics_id, **kwargs):
    user_mc = user_mediacloud_client()
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    # grab the timespan because we need the start and end dates
    timespan = user_mc.topicTimespanList(topics_id, snapshots_id=snapshots_id, foci_id=foci_id, timespans_id=timespans_id)[0]
    response = user_mc.topicSentenceCount(topics_id,
        split=True, split_start_date=timespan['start_date'][:10], split_end_date=timespan['end_date'][:10],
        **kwargs)
    return response

def stream_sentence_count_csv(user_mc_key, filename, topics_id, **kwargs):
    results = split_sentence_count(user_mc_key, topics_id, **kwargs)
    clean_results = [{'date': date, 'numFound': count} for date, count in results['split'].iteritems() if date not in ['gap', 'start', 'end']]
    props = ['date', 'numFound']
    return csv.stream_response(clean_results, props, filename)

@app.route('/api/topics/<topics_id>/sentences/focal-set/<focal_sets_id>/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_focal_set_sentences_compare(topics_id, focal_sets_id):
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    user_mc = user_mediacloud_client()
    all_focal_sets = focal_set_list(user_mediacloud_key(), topics_id, snapshots_id)
    # need the timespan info, to find the appropriate timespan with each focus
    base_snapshot_timespans = user_mc.topicTimespanList(topics_id, snapshots_id=snapshots_id)
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
        snapshot_timespans = user_mc.topicTimespanList(topics_id, snapshots_id=snapshots_id, foci_id=focus['foci_id'])
        timespan = None
        for t in snapshot_timespans:
            if t['start_date'] == base_timespan['start_date'] and t['end_date'] == base_timespan['end_date'] and t['period'] == base_timespan['period']:
                timespan = t
                logger.info('matching in focus %s, timespan = %s', focus['foci_id'], t['timespans_id'])
        if timespan is None:
            return json_error_response('Couldn\'t find a matching timespan in the '+focus.name+' focus')
        data = split_sentence_count(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id, timespans_id=timespan['timespans_id'], foci_id=focus['foci_id'])
        focus['sentence_counts'] = data
    return jsonify(focal_set)
