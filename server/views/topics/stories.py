import logging
from operator import itemgetter
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topic_id>/top-stories', methods=['GET'])
#@flask_login.login_required
def api_topics_top_stories(topic_id):
    sort = request.args.get('sort')
    valid_sorts = ['social','inlink']
    if (sort is None) or (sort not in valid_sorts):
        sort = valid_sorts[0]
    snapshot_id = request.args.get('snapshot')
    timespan_id = request.args.get('timespan')
    limit = request.args.get('limit')
    continuation_id = request.args.get('continuationId')
    stories = mc.topicStoryList(topic_id,snapshot_id=snapshot_id,timespan_id=timespan_id,sort=sort,
        limit=limit,continuation_id=continuation_id)
    return jsonify(stories)
