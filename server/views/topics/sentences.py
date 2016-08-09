import logging
from flask import jsonify, request
import flask_login

from server import app, mc
import server.views.util.csv as csv
from server.cache import cache

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/sentences/count', methods=['GET'])
#@flask_login.login_required
def topic_sentence_count(topics_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    response = split_sentence_count(topics_id, snapshots_id, timespans_id)
    return jsonify(response)

@app.route('/api/topics/<topics_id>/sentences/count.csv', methods=['GET'])
#@flask_login.login_required
def topic_sentence_count_csv(topics_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    return stream_sentence_count_csv('sentence-counts', topics_id, snapshots_id, timespans_id)

@cache
def split_sentence_count(topics_id, snapshots_id, timespans_id, **kwargs):
    # TODO: replace with timespan/single call once it is ready
    timespan = None
    timespan_list = mc.topicTimespanList(topics_id, snapshots_id=snapshots_id)
    for t in timespan_list:
        if t['timespans_id'] == int(timespans_id):
            timespan = t

    response = mc.topicSentenceCount(topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id,
        split=True, split_start_date=timespan['start_date'][:10], split_end_date=timespan['end_date'][:10],
        **kwargs)
    return response

def stream_sentence_count_csv(filename, topics_id, snapshots_id, timespans_id, **kwargs):
    results = split_sentence_count(topics_id, snapshots_id, timespans_id, **kwargs)
    clean_results = [{'date': date, 'numFound': count} for date, count in results['split'].iteritems()]
    props = ['date', 'numFound']
    return csv.stream_response(clean_results, props, filename)
