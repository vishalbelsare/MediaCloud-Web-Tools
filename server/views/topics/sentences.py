import logging
from flask import jsonify, request
import flask_login

from server import app, mc
import server.views.util.csv as csv

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/sentences/count', methods=['GET'])
#@flask_login.login_required
def topic_sentence_count(topic_id):
    snapshot_id = request.args.get('snapshotId')
    timespan_id = request.args.get('timespanId')
    response = _sentence_count(topic_id, snapshot_id, timespan_id)
    return jsonify(response)

@app.route('/api/topics/<topic_id>/sentences/count.csv', methods=['GET'])
#@flask_login.login_required
def topic_sentence_count_csv(topic_id):
    snapshot_id = request.args.get('snapshotId')
    timespan_id = request.args.get('timespanId')
    response = _sentence_count(topic_id, snapshot_id, timespan_id)
    props = ['date', 'numFound']
    return csv.stream_response(response['split']['counts'], props, 'stories')

def _sentence_count(topic_id, snapshot_id, timespan_id):
    # TODO: replace with timespan/single call
    timespan = None
    timespan_list = mc.topicTimespanList(topic_id, snapshot_id)
    for t in timespan_list:
        if t['timespans_id'] == int(timespan_id):
            timespan = t
    response = mc.topicSentenceCount(topic_id, snapshot_id=snapshot_id, timespan_id=timespan_id,
        split=True, split_start_date=timespan['start_date'][:10],
        split_end_date=timespan['end_date'][:10])
    return response
