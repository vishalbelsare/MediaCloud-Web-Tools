import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/focal-sets', methods=['GET'])
#@flask_login.login_required
def topic_focal_set_list(topics_id):
    snapshots_id = request.args.get('snapshotId')
    focal_sets = mc.topicFocalSetList(topics_id, snapshots_id=snapshots_id)
    return jsonify(focal_sets)
