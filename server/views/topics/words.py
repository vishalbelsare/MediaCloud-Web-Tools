import logging
from operator import itemgetter
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/top-words', methods=['GET'])
#@flask_login.login_required
def api_topics_top_words(topic_id):
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    words = mc.topicWordCount(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id)[:100]
    return jsonify({'list':words})
