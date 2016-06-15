import logging
from operator import itemgetter
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
#@flask_login.login_required
def api_topics_list():
    controversy_list = mc.controversyList()
    return jsonify({'list':controversy_list})

@app.route('/api/topics/<topic_id>/summary', methods=['GET'])
#@flask_login.login_required
def api_topics_summary(topic_id):
    controversy = mc.controversy(topic_id)
    return jsonify(controversy)

@app.route('/api/topics/<topic_id>/snapshots/list', methods=['GET'])
#@flask_login.login_required
def api_topics_snapshots_list(topic_id):
    snapshots = mc.controversyDumpList(topic_id)
    return jsonify({'list':snapshots})

@app.route('/api/topics/<topic_id>/snapshots/<snapshot_id>/timespans/list', methods=['GET'])
#@flask_login.login_required
def api_topics_timespan_list(topic_id,snapshot_id):
    snapshots = mc.controversyDumpTimeSliceList(snapshot_id)
    return jsonify({'list':snapshots})
