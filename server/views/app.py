import logging
from flask import jsonify
import codecs
import os
import json

from server import app, mc, data_dir
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)


@app.route('/api/system-stats', methods=['GET'])
@api_error_handler
def stats():
    result = mc.stats()
    return jsonify({'stats': result})


@app.route('/api/release-notes', methods=['GET'])
@api_error_handler
def release_notes():
    # needed to put this behind an endpoint so browser doesn't cache it
    release_history = json.load(codecs.open(os.path.join(data_dir, 'release_history.json'), 'r', 'utf-8'))
    return jsonify(release_history)
