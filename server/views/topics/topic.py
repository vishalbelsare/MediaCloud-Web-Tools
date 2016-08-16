import logging
from flask import jsonify, request
import flask_login

from server import app
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client

logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
@flask_login.login_required
def topic_list():
    user_mc = user_mediacloud_client()
    link_id = request.args.get('linkId')
    all_topics = user_mc.topicList(link_id=link_id)
    return jsonify(all_topics)

@app.route('/api/topics/<topics_id>/summary', methods=['GET'])
@flask_login.login_required
def topic_summary(topics_id):
    topic = _topic_summary(user_mediacloud_key(), topics_id)
    return jsonify(topic)

@cache
def _topic_summary(user_mc_key, topics_id):
    user_mc = user_mediacloud_client()
    return user_mc.topic(topics_id)

@app.route('/api/topics/<topics_id>/snapshots/list', methods=['GET'])
@flask_login.login_required
def topic_snapshots_list(topics_id):
    user_mc = user_mediacloud_client()
    snapshots = user_mc.topicSnapshotList(topics_id)
    return jsonify({'list':snapshots})

@app.route('/api/topics/<topics_id>/snapshots/generate', methods=['POST'])
@flask_login.login_required
def topic_snapshot_generate(topics_id):
    user_mc = user_mediacloud_client()
    results = user_mc.topicGenerateSnapshot(topics_id)
    return jsonify(results)

@cache
@app.route('/api/topics/<topics_id>/snapshots/<snapshots_id>/timespans/list', methods=['GET'])
@flask_login.login_required
def topic_timespan_list(topics_id, snapshots_id):
    user_mc = user_mediacloud_client()
    foci_id = request.args.get('focusId')
    timespans = _topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id, foci_id)
    return jsonify({'list':timespans})

@cache
def _topic_timespan_list(user_mc_key, topics_id, snapshots_id, foci_id):
    user_mc = user_mediacloud_client()
    timespans = user_mc.topicTimespanList(topics_id, snapshots_id=snapshots_id, foci_id=foci_id)
    return timespans
