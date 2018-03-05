import logging
from flask import jsonify

from server import app, mc
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)


@app.route('/api/system-stats', methods=['GET'])
@api_error_handler
def stats():
    result = mc.stats()
    return jsonify({'stats': result})
