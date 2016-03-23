import logging
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from mediameter import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/controversy-list', methods=['GET'])
@flask_login.login_required
def api_controversy_list():
    controversy_list = mc.controversyList()
    logger.debug(controversy_list)
    return jsonify({'results':controversy_list})
