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

@app.route('/api/controversy/<controvery_id>/summary', methods=['GET'])
#@flask_login.login_required
def api_controversy_summary(controvery_id):
	controversy = mc.controversy(controvery_id)
	dumps = mc.controversyDumpList(controvery_id)
	controversy['dumps'] = dumps
	# TODO: iterate over list to flag the latest one (dump_date)
	return jsonify({'results':controversy})
