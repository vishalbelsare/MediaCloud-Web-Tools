import logging
from flask import jsonify
import flask_login

from server import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
#@flask_login.login_required
def topic_list():
    all_topics = mc.topicList()
    return jsonify({'list':all_topics})

@app.route('/api/topics/<topic_id>/summary', methods=['GET'])
#@flask_login.login_required
def topic_summary(topic_id):
    topic = mc.topic(topic_id)
    return jsonify(topic)

@app.route('/api/topics/<topic_id>/snapshots/list', methods=['GET'])
#@flask_login.login_required
def topic_snapshots_list(topic_id):
    snapshots = mc.topicSnapshotList(topic_id)
    return jsonify({'list':snapshots})

@app.route('/api/topics/<topic_id>/snapshots/<snapshot_id>/timespans/list', methods=['GET'])
#@flask_login.login_required
def topic_timespan_list(topic_id, snapshot_id):
    snapshots = mc.topicTimespanList(topic_id, snapshot_id)
    return jsonify({'list':snapshots})
