import logging
from operator import itemgetter
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
import server.util.csv as csv
from server.util.request import filters_from_args, api_error_handler, json_error_response
from server.auth import user_mediacloud_key, is_user_logged_in
from server.views.topics.apicache import topic_split_story_counts, topic_focal_sets, cached_topic_timespan_list, topic_timespan
from server.views.topics import access_public_topic, concatenate_solr_dates

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/split-story/count', methods=['GET'])
@api_error_handler
def topic_split_story_count(topics_id):
    if access_public_topic(topics_id):
        results = topic_split_story_counts(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None, foci_id=None,q=None)
    elif is_user_logged_in():
        results = topic_split_story_counts(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})

    return jsonify({'results': results})


@app.route('/api/topics/<topics_id>/split-story/count.csv', methods=['GET'])
@flask_login.login_required
def topic_story_count_csv(topics_id):
    return stream_topic_split_story_counts_csv(user_mediacloud_key(), 'splitStoryCounts-Topic-' + topics_id, topics_id)


def stream_topic_split_story_counts_csv(user_mc_key, filename, topics_id, **kwargs):
    results = topic_split_story_counts(user_mc_key, topics_id, **kwargs)
    clean_results = [{'date': date, 'stories': count} for date, count in results['split'].iteritems()]
    sorted_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'stories']
    return csv.stream_response(sorted_results, props, filename)


@app.route('/api/topics/<topics_id>/split-stories/focal-set/<focal_sets_id>/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_focal_set_split_stories_compare(topics_id, focal_sets_id):
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    all_focal_sets = topic_focal_sets(user_mediacloud_key(), topics_id, snapshots_id)
    # need the timespan info, to find the appropriate timespan with each focus
    base_snapshot_timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id)
    # if they have a focus selected, we need to find the appropriate overall timespan
    if foci_id is not None:
        timespan = topic_timespan(topics_id, snapshots_id, foci_id, timespans_id)
        for t in base_snapshot_timespans:
            if timespans_match(timespan, t):
                base_timespan = t
    else:
        base_timespan = None
        for t in base_snapshot_timespans:
            if t['timespans_id'] == int(timespans_id):
                base_timespan = t
                logger.info('base timespan = %s', timespans_id)
    if base_timespan is None:
        return json_error_response("Couldn't find the timespan you specified")
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
            if timespans_match(t, base_timespan):
                timespan = t
                logger.info('matching in focus %s, timespan = %s', focus['foci_id'], t['timespans_id'])
        if timespan is None:
            return json_error_response('Couldn\'t find a matching timespan in the '+focus.name+' focus')
        data = topic_split_story_counts(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id, timespans_id=timespan['timespans_id'], foci_id=focus['foci_id'])
        focus['story_counts'] = data
    return jsonify(focal_set)


def timespans_match(timespan1, timespan2):
    '''
    Useful to compare two timespans from different subtopics
    :return: true if they match, false if they don't
    '''
    match = (timespan1['start_date'] == timespan2['start_date']) \
            and (timespan1['end_date'] == timespan2['end_date']) \
            and (timespan1['period'] == timespan2['period'])
    return match
