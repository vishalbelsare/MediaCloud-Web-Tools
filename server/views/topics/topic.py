import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache

logger = logging.getLogger(__name__)

@cache
@app.route('/api/topics/list', methods=['GET'])
@flask_login.login_required
def topic_list():
    link_id = request.args.get('linkId')
    all_topics = mc.topicList(link_id=link_id)
    return jsonify(all_topics)

@cache
@app.route('/api/topics/<topics_id>/summary', methods=['GET'])
@flask_login.login_required
def topic_summary(topics_id):
    topic = mc.topic(topics_id)
    return jsonify(topic)

@cache
@app.route('/api/topics/<topics_id>/snapshots/list', methods=['GET'])
@flask_login.login_required
def topic_snapshots_list(topics_id):
    snapshots = mc.topicSnapshotList(topics_id)
    return jsonify({'list':snapshots})

@cache
@app.route('/api/topics/<topics_id>/snapshots/<snapshots_id>/timespans/list', methods=['GET'])
@flask_login.login_required
def topic_timespan_list(topics_id, snapshots_id):
    snapshots = mc.topicTimespanList(topics_id, snapshots_id=snapshots_id)
    return jsonify({'list':snapshots})
