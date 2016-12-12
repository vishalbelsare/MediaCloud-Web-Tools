import logging
from flask import request, jsonify
import flask_login
from server import app
from server.util.request import arguments_required, form_fields_required, api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.sources.words import cached_wordcount, stream_wordcount_csv
from server.views.sources.geocount import stream_geo_csv, cached_geotag_count
from server.views.sources.sentences import cached_recent_sentence_counts, stream_sentence_count_csv

from server.views.sources.geoutil import country_list

logger = logging.getLogger(__name__)

@app.route('/api/sources/all', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_media_source_list():
    source_list = _cached_media_source_list(user_mediacloud_key())
    return jsonify({'results':source_list})

@cache
def _cached_media_source_list(user_mc_key):
    user_mc = user_mediacloud_client()
    source_list = user_mc.mediaList(last_media_id=0, rows=100)
    #source_list = sorted(source_list, key=lambda ts: ts['label'])
    return source_list

@app.route('/api/sources/list', methods=['GET'])
@arguments_required('src[]')
@flask_login.login_required
@api_error_handler
def api_media_sources_by_ids():
    source_list = []
    sourceIdArray = request.args['src[]'].split(',')
    for mediaId in sourceIdArray:
        info = {}
        info = _cached_media_source_details(user_mediacloud_key(), mediaId)
        source_list.append(info);
    return jsonify({'results':source_list})


@cache
def _cached_media_source_health(user_mc_key, media_id):
    user_mc = user_mediacloud_client()
    return user_mc.mediaHealth(media_id)

@cache
def _cached_media_source_details(user_mc_key, media_id, start_date_str=None):
    user_mc = user_mediacloud_client()
    info = user_mc.media(media_id)
    info['id'] = media_id
    info['feedCount'] = len(user_mc.feedList(media_id=media_id, rows=100))
    return info

@app.route('/api/sources/<media_id>/details')
@flask_login.login_required
@api_error_handler
def api_media_source_details(media_id):
    health = _cached_media_source_health(user_mediacloud_key(), media_id)
    info = {}
    info = _cached_media_source_details(user_mediacloud_key(), media_id, health['start_date'][:10])
    info['health'] = health
    return jsonify({'results':info})

@app.route('/api/sources/<media_id>/sentences/sentence-count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_sentence_count_csv(media_id):
    return stream_sentence_count_csv(user_mediacloud_key(), 'sentenceCounts-Source-'+ media_id, media_id, "media_id")

@app.route('/api/sources/<media_id>/sentences/count')
@flask_login.login_required
@api_error_handler
def api_media_source_sentence_count(media_id):
    health = _cached_media_source_health(user_mediacloud_key(), media_id)
    info = {}
    info['health'] = health
    info['sentenceCounts'] = cached_recent_sentence_counts(user_mediacloud_key(), ['media_id:'+str(media_id)], health['start_date'][:10])
    return jsonify({'results':info})

@app.route('/api/sources/<media_id>/geography')
@flask_login.login_required
@api_error_handler
def api_media_source_geography(media_id):
    info = {}
    info['geography'] = cached_geotag_count(user_mediacloud_key(), 'media_id:'+str(media_id))
    return jsonify({'results':info})


@app.route('/api/sources/<media_id>/geography/geography.csv')
@flask_login.login_required
@api_error_handler
def source_geo_csv(media_id):
    return stream_geo_csv(user_mediacloud_key(), 'geography-Source-'+media_id, media_id, "media_id")

@app.route('/api/sources/<media_id>/words/wordcount.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_wordcount_csv(media_id):
    return stream_wordcount_csv(user_mediacloud_key(), 'wordcounts-Source-'+media_id, media_id, "media_id")

@app.route('/api/sources/<media_id>/words')
@flask_login.login_required
@api_error_handler
def media_source_words(media_id):
    info = {
        'wordcounts': cached_wordcount(user_mediacloud_key(), 'media_id:'+str(media_id))
    }
    return jsonify({'results':info})

@app.route('/api/sources/create', methods=['POST'])
@form_fields_required('name', 'url','notes')
@flask_login.login_required
@api_error_handler
def source_create():
    user_mc = user_mediacloud_client()
    name = request.form['name']
    url = request.form['url']
    notes = request.form['notes']
    collection_ids = request.form.getlist('collections[]')
    detected_language = request.form['detectedLanguage']
    fakenew_source = user_mc.media(1)
    return jsonify(fakenew_source)
