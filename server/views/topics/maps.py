import logging
from flask import jsonify, request
import flask_login
import os

from server import app, base_dir
import server.util.csv as csv
from server.auth import user_mediacloud_key
from server.util.request import arguments_required, filters_from_args, api_error_handler
from server.util import mapwriter

DATA_DIR = os.path.join(base_dir, "data", "map-files")
MAP_TYPES = ['wordMap', 'linkMap']

logger = logging.getLogger(__name__)

@app.route('/api/topics/<topics_id>/map-files', methods=['GET'])
@flask_login.login_required
@arguments_required('snapshotId','timespanId')
@api_error_handler
def map_files(topics_id):
    files = { 
        'wordMap': 'unsupported',
        'linkMap': 'not rendered'
    }
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    map_type = MAP_TYPES[0] # no linkMaps yet
    status = None
    prefix = _get_file_prefix(map_type, topics_id, timespans_id)
    lock_filename = prefix+".lock"
    rendered_filename = prefix+".gexf"
    # check if rendered file is there
    is_rendered = os.path.isfile(os.path.join(DATA_DIR,rendered_filename))
    logger.warn(os.path.join(DATA_DIR,rendered_filename))
    logger.warn(is_rendered)
    if is_rendered:
        status = 'rendered'
    else:
        is_generating = os.path.isfile(os.path.join(DATA_DIR,lock_filename))
        if not is_generating:
            _start_generating_map_file(map_type, topics_id, timespans_id)
        status = 'generating'
    files[map_type] = status
    return jsonify(files)

@app.route('/api/topics/<topics_id>/map-files/<map_type>.<map_format>', methods=['GET'])
@arguments_required('timespanId')
@flask_login.login_required
def map_files_download(topics_id, map_type, map_format):
    filename = request.args[map_type]+"-"+topics_id+"-"+request.args['timespanId']+"."+map_format
    return send_from_directory(directory=DATA_DIR, filename=filename)

'''
@app.route('/api/topics/<topics_id>/map-files/<map_type>/generate', methods=['GET'])
#@flask_login.login_required
@arguments_required('snapshotId','timespanId')
@api_error_handler
def request_map_file(topics_id, map_type):
    if map_type not in MAP_TYPES:
        raise ValueError('Invalid map type '+map_type)
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    _start_generating_map_file(map_type,topics_id,snapshots_id, foci_id, timespans_id)
    # TODO: make a request to generate the map file
    return jsonify({'success': 1})
'''

def _start_generating_map_file(map_type, topics_id, timespans_id):
    file_prefix = _get_file_prefix(map_type, topics_id, timespans_id)
    # create map file
    lock_filename = file_prefix+'.lock'
    open(os.path.join(DATA_DIR,lock_filename), 'a').close()
    # generate maps
    file_path = os.path.join(DATA_DIR, file_prefix)
    mapwriter.create_word_map_files(topics_id, timespans_id, file_path)
    # remove lock file
    os.remove(lock_filename)

def _get_file_prefix(map_type, topics_id, timespans_id):
    return map_type+"-"+str(topics_id)+"-"+str(timespans_id)
