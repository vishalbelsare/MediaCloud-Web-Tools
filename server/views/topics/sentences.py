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
    response = _sentence_count(topics_id, snapshots_id, timespans_id)
    return jsonify(response)

@app.route('/api/topics/<topics_id>/sentences/count.csv', methods=['GET'])
#@flask_login.login_required
def topic_sentence_count_csv(topics_id):
    snapshots_id = request.args.get('snapshotId')
    timespans_id = request.args.get('timespanId')
    response = _sentence_count(topics_id, snapshots_id, timespans_id)
    props = ['date', 'numFound']
    return csv.stream_response(response['split']['counts'], props, 'stories')

@cache
def _sentence_count(topics_id, snapshots_id, timespans_id):
    # TODO: replace with timespan/single call
    timespan = None
    timespan_list = mc.topicTimespanList(topics_id, snapshots_id=snapshots_id)
    for t in timespan_list:
        if t['timespans_id'] == int(timespans_id):
            timespan = t
    response = mc.topicSentenceCount(topics_id, snapshots_id=snapshots_id, timespans_id=timespans_id,
        split=True, split_start_date=timespan['start_date'][:10],
        split_end_date=timespan['end_date'][:10])
    return response
