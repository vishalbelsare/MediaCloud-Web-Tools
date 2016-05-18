import logging
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from mediameter import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
#@flask_login.login_required
def api_topics_list():
    controversy_list = mc.controversyList()
    return jsonify({'results':controversy_list})

@app.route('/api/topics/<topic_id>/summary', methods=['GET'])
#@flask_login.login_required
def api_topics_summary(topic_id):
    controversy = mc.controversy(topic_id)
    return jsonify({'results':controversy})

@app.route('/api/topics/<topic_id>/snapshots/list', methods=['GET'])
#@flask_login.login_required
def api_topics_snapshots_list(topic_id):
    snapshots = mc.controversyDumpList(topic_id)
    return jsonify({'results':snapshots})


@app.route('/api/topics/<topic_id>/snapshots/<snapshot_id>/timespans/list', methods=['GET'])
#@flask_login.login_required
def api_topics_timespan_list(topic_id,snapshot_id):
    snapshots = mc.controversyDumpTimeSliceList(snapshot_id)
    return jsonify({'results':snapshots})

@app.route('/api/topics/<topic_id>/top-stories', methods=['GET'])
#@flask_login.login_required
def api_topics_top_stories(topic_id):
    sort = request.args.get('sort')
    valid_sorts = ['social','inlink']
    if (sort is None) or (sort not in valid_sorts):
        sort = valid_sorts[0]
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    stories = mc.topicStoryList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,limit=25,sort=sort)
    return jsonify({'results':stories})

@app.route('/api/topics/<topic_id>/top-media', methods=['GET'])
#@flask_login.login_required
def api_topics_top_media(topic_id):
    sort = request.args.get('sort')
    valid_sorts = ['social','inlink']
    if (sort is None) or (sort not in valid_sorts):
        sort = valid_sorts[0]
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    media = mc.topicMediaList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort)[:25]
    return jsonify({'results':media})

@app.route('/api/topics/<topic_id>/top-words', methods=['GET'])
#@flask_login.login_required
def api_topics_top_words(topic_id):
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    media = mc.topicWordCount(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id)[:100]
    return jsonify({'results':media})
