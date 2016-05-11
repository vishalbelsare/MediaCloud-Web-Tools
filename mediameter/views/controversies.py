import logging
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from mediameter import app, mc

logger = logging.getLogger(__name__)

@app.route('/api/controversy/list', methods=['GET'])
#@flask_login.login_required
def api_controversy_list():
    controversy_list = mc.controversyList()
    return jsonify({'results':controversy_list})

@app.route('/api/controversy/<controversy_id>/summary', methods=['GET'])
#@flask_login.login_required
def api_controversy_summary(controversy_id):
    controversy = mc.controversy(controversy_id)
    dumps = mc.controversyDumpList(controversy_id)
    controversy['dumps'] = dumps
    # TODO: iterate over list to flag the latest one (dump_date)
    return jsonify({'results':controversy})

@app.route('/api/controversy/<controversy_id>/top-stories', methods=['GET'])
#@flask_login.login_required
def api_controversy_top_stories(controversy_id):
    query = "{{~ controversy:{0} }}".format(controversy_id)
    stories = mc.storyList(query)
    return jsonify({'results':stories})
