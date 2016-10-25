import logging
from flask import jsonify, request
import flask_login

from server import app, db, mc
from server.util.request import form_fields_required, api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name
from server.views.sources.words import _wordcount
from server.views.sources.words import stream_wordcount_csv
from server.views.sources.geocount import stream_geo_csv
from server.views.sources.geocount import _geotag_count
from server.views.sources.sentences import _recent_sentence_counts
from server.views.sources.sentences import stream_sentence_count_csv

logger = logging.getLogger(__name__)

@app.route('/api/sources/source/list', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def api_media_source_list ():
    source_list = _get_media_source_list()
    return jsonify({'results':source_list})

@cache
#Helper
def _get_media_source_list():
    source_list = mc.mediaList(last_media_id=0,rows=100)
    #source_list = sorted(source_list, key=lambda ts: ts['label'])
    return source_list

@cache
#Helper
def _get_media_source_health(media_id):
    return mc.mediaHealth(media_id)
    ###??

@cache
#Helper
def _get_media_source_details(media_id, start_date_str = None):
    info = mc.media(media_id)
    info['id'] = media_id
    info['sentenceCounts'] = _recent_sentence_counts( ['media_id:'+str(media_id)], start_date_str )
    info['feedCount'] = len(mc.feedList(media_id=media_id,rows=100))
    return info


@app.route('/api/sources/<media_id>/details')
@flask_login.login_required
@api_error_handler 
def api_media_source_details(media_id):
    health = _get_media_source_health(media_id)
    info = {}
    info = _get_media_source_details(media_id, health['start_date'][:10])
    info['health'] = health
    return jsonify({'results':info})

@app.route('/api/sources/<media_id>/sentences/sentence-count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def source_sentence_count_csv(media_id):  
    return stream_sentence_count_csv( 'sentenceCounts-Source-'+ media_id, media_id, "media_id");


@app.route('/api/sources/<media_id>/sentences/count')
@flask_login.login_required
@api_error_handler 
@cache
def api_media_source_sentence_count(media_id):
    health = _get_media_source_health(media_id)
    info = {}
    info['health'] = health
    info['sentenceCounts'] = _recent_sentence_counts( ['media_id:'+str(media_id)], health['start_date'][:10] )
    return jsonify({'results':info})

@app.route('/api/sources/<media_id>/geography')
@flask_login.login_required
@api_error_handler 
def api_media_source_geography(media_id):
    info = {}
    info['geography'] = _geotag_count('media_id:'+str(media_id))
    return jsonify({'results':info})


@app.route('/api/sources/<media_id>/source/geography/geography.csv')
@flask_login.login_required
@api_error_handler 
def source_geo_csv(media_id):  
    return stream_geo_csv( 'geography-Source-' + media_id, media_id, "media_id");

@app.route('/api/sources/<media_id>/words/wordcount.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def source_wordcount_csv(media_id):  
    return stream_wordcount_csv( 'wordcounts-Source-' + media_id, media_id, "media_id");


@app.route('/api/sources/<media_id>/words')
@flask_login.login_required
@api_error_handler 
def media_source_words(media_id):
    info = {}
    info['wordcounts'] = _wordcount('media_id:'+str(media_id))
    return jsonify({'results':info})
