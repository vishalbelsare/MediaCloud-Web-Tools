import logging
from flask import jsonify, request
import flask_login

from server import app
import server.util.csv as csv
from server.cache import cache
from server.util.request import filters_from_args, api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client

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
