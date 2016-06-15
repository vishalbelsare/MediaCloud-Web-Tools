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
    return jsonify(stories)

@app.route('/api/topics/<topic_id>/top-media', methods=['GET'])
#@flask_login.login_required
def api_topics_top_media(topic_id):
    sort = request.args.get('sort')
    valid_sorts = ['social','inlink']
    if (sort is None) or (sort not in valid_sorts):
        sort = valid_sorts[0]
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    media = mc.topicMediaList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort)
    return jsonify(media)

@app.route('/api/topics/<topic_id>/top-words', methods=['GET'])
#@flask_login.login_required
def api_topics_top_words(topic_id):
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    words = mc.topicWordCount(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id)[:100]
    return jsonify({'list':words})

@app.route('/api/topics/<topic_id>/sentences/count', methods=['GET'])
#@flask_login.login_required
def api_topics_sentence_count(topic_id):
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    # fake out for now
    topicTimespan = mc.controversyDumpTimeSlice(timespan_id)
    response = mc.sentenceCount("{~ controversy_dump_time_slice:"+str(timespan_id)+" }",
        split=True,split_start_date=topicTimespan['start_date'][:10],
        split_end_date=topicTimespan['end_date'][:10])
    counts = []
    for k,v in response['split'].iteritems():
        if k in ['end','gap','start']:
            continue
        counts.append({ 'date': k, 'count':v })
    counts = sorted(counts, key=itemgetter('date'))
    results = {
        'total': response['count'],
        'gap': response['split']['gap'],
        'end': response['split']['end'],
        'start': response['split']['start'],
        'counts': counts
    }
    return jsonify(results)
