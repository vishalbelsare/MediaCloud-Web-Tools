import logging
from flask import request, jsonify
import flask_login
from mediacloud.tags import MediaTag, TAG_ACTION_ADD, TAG_ACTION_REMOVE
from server import app
from server.util.request import arguments_required, form_fields_required, api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.sources import COLLECTIONS_TAG_SET_ID, GV_TAG_SET_ID, EMM_TAG_SET_ID
from server.views.sources.words import cached_wordcount, stream_wordcount_csv
from server.views.sources.geocount import stream_geo_csv, cached_geotag_count
from server.views.sources.sentences import cached_recent_sentence_counts, stream_sentence_count_csv
from server.views.sources.feeds import cached_feed, stream_feed_csv, source_feed_list

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

@app.route('/api/sources/<media_id>/feeds', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_source_feed(media_id):
    feed_list = source_feed_list(media_id)
    feed_count = len(feed_list)
    return jsonify({'results':feed_list, 'count':feed_count})

@app.route('/api/sources/<media_id>/feeds/feeds.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_feed_csv(media_id):
    return stream_feed_csv('feeds-Source-'+ media_id, media_id)

@cache
def _cached_media_source_health(user_mc_key, media_id):
    user_mc = user_mediacloud_client()
    return user_mc.mediaHealth(media_id)

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
    #collection_ids = request.args.getlist('collections[]')
    #detected_language = request.args['detectedLanguage']
    fakenew_source = user_mc.media(1)
    return jsonify(fakenew_source)

@app.route('/api/sources/<media_id>/update', methods=['POST'])
@form_fields_required('name', 'url')
@flask_login.login_required
@api_error_handler  
def source_update(media_id):
    user_mc = user_mediacloud_client()
    # update the basic info
    name = request.form['name']
    url = request.form['url']
    notes = request.form['notes'] if 'notes' in request.form else None # this is optional
    result = user_mc.mediaUpdate(media_id, url=url, name=name, editor_notes=notes)
    # now we need to update the collections separately, because they are tags on the media source
    source = user_mc.media(media_id)
    existing_tag_ids = [ t['tags_id'] for t in source['media_source_tags']
        if t['tag_sets_id'] in [COLLECTIONS_TAG_SET_ID, GV_TAG_SET_ID, EMM_TAG_SET_ID]]
    tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",")]
    tag_ids_to_remove = list(set(existing_tag_ids) - set(tag_ids_to_add))
    tags_to_add = [MediaTag(media_id, tags_id=cid, action=TAG_ACTION_ADD) for cid in tag_ids_to_add]
    tags_to_remove = [MediaTag(media_id, tags_id=cid, action=TAG_ACTION_REMOVE) for cid in tag_ids_to_remove]
    tags = tags_to_add + tags_to_remove
    user_mc.tagMedia(tags=tags)
    #detected_language = request.args['detectedLanguage']
    return jsonify(result)

@app.route('/api/sources/suggestions/submit', methods=['POST'])
@form_fields_required('url','feedurl')
@flask_login.login_required
@api_error_handler
def source_suggest():
    user_mc = user_mediacloud_client()
    # name = request.form['name'] how do we get non-required fields without throwign an exception here?
    url = request.form['url']
    feedurl = request.form['feedurl']
    # notes = request.form['reason','']
    #collection_ids = request.args.getlist('collections[]')
    fakenew_suggestion = user_mc.media(1)
    return jsonify(fakenew_suggestion)


