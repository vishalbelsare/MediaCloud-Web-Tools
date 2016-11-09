import logging
from flask import jsonify
import flask_login

from server import app
from server.util.request import api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.sources.words import cached_wordcount, stream_wordcount_csv
from server.views.sources.geocount import stream_geo_csv, cached_geotag_count
from server.views.sources.sentences import cached_recent_sentence_counts, stream_sentence_count_csv
import server.util.csv as csv

logger = logging.getLogger(__name__)

@app.route('/api/collection/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_get_collection_list():
    user_mc = user_mediacloud_client()
    tag_list = user_mc.tagList(tag_sets_id=5, rows=100)
    #tag_list = sorted(tag_list, key=lambda ts: ts['label'])
    return jsonify({'results':tag_list})

@app.route('/api/collections/<collection_id>/details')
@flask_login.login_required
@api_error_handler
def api_collection_details(collection_id):
    user_mc = user_mediacloud_client()
    info = user_mc.tag(collection_id)
    info['id'] = collection_id
    info['tag_set'] = _cached_tag_set_info(user_mediacloud_key(), info['tag_sets_id'])
    all_media = _cached_collection_media_list(user_mediacloud_key(), collection_id)
    info['media'] = [{'id':m['media_id'], 'name':m['name']} for m in all_media]
    return jsonify({'results':info})

@app.route('/api/collections/<collection_id>/sources.csv')
@flask_login.login_required
@api_error_handler
def api_collection_sources_csv(collection_id):
    user_mc = user_mediacloud_client()
    info = user_mc.tag(collection_id)
    all_media = _cached_collection_media_list(user_mediacloud_key(), collection_id)
    props = ['media_id', 'name', 'url']
    filename = info['label']+" - sources.csv"
    return csv.stream_response(all_media, props, filename)

@app.route('/api/collections/<collection_id>/sources/sentences/count')
@flask_login.login_required
@api_error_handler
def collection_source_sentence_counts(collection_id):
    # first decide to bail if there are too many sources (cause the query takes too long)
    sources = _cached_collection_media_list(user_mediacloud_key(), collection_id)
    if len(sources) > 30:
        sources_with_counts = []
    else:
        sources_with_counts = _cached_collection_source_sentence_counts(user_mediacloud_key(), collection_id)
    return jsonify({'sources': sources_with_counts})

@app.route('/api/collections/<collection_id>/sources/sentences/count.csv')
@flask_login.login_required
@api_error_handler
def collection_source_sentence_counts_csv(collection_id):
    user_mc = user_mediacloud_client()
    info = user_mc.tag(collection_id)
    sources = _cached_collection_source_sentence_counts(user_mediacloud_key(), collection_id)
    props = ['media_id', 'name', 'url', 'sentence_count', 'sentence_pct']
    filename = info['label']+" - source sentence counts.csv"
    return csv.stream_response(sources, props, filename)

@cache
def _cached_collection_source_sentence_counts(user_mc_key, collection_id):
    # get the list of sources
    sources = _cached_collection_media_list(user_mediacloud_key(), collection_id)
    total_sentences = 0
    # get the count for each source
    for s in sources:
        s['sentence_count'] = _cached_sentences_count(user_mediacloud_key(), s['media_id'])['count']
        total_sentences = total_sentences + s['sentence_count']
    # add in percentages for each source
    for s in sources:
        s['sentence_pct'] = float(s['sentence_count']) / float(total_sentences)
    return sources

@cache
def _cached_sentences_count(user_mc_key, media_id):
    user_mc = user_mediacloud_client()
    return user_mc.sentenceCount('*', 'media_id:'+str(media_id))

@cache
def _cached_tag_set_info(user_mc_key, tag_sets_id):
    user_mc = user_mediacloud_client()
    return user_mc.tagSet(tag_sets_id)

@cache
def _cached_collection_media_list(user_mc_key, tags_id):
    user_mc = user_mediacloud_client()
    more_media = True
    all_media = []
    max_media_id = 0
    while more_media:
        logger.debug("last_media_id %d", max_media_id)
        media = user_mc.mediaList(tags_id=tags_id, last_media_id=max_media_id, rows=100)
        all_media = all_media + media
        if len(media) > 0:
            max_media_id = media[len(media)-1]['media_id']
        more_media = len(media) != 0
    return sorted(all_media, key=lambda t: t['name'])

@app.route('/api/collections/<collection_id>/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_collection_sentence_count(collection_id):
    info = {}
    info['sentenceCounts'] = cached_recent_sentence_counts(user_mediacloud_key(), ['tags_id_media:'+str(collection_id)])
    return jsonify({'results':info})

@app.route('/api/collections/<collection_id>/sentences/sentence-count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_sentence_count_csv(collection_id):
    return stream_sentence_count_csv(user_mediacloud_key(), 'sentenceCounts-Collection-' +collection_id, collection_id, "tags_id_media")

@app.route('/api/collections/<collection_id>/geography')
@flask_login.login_required
@api_error_handler
def geo_geography(collection_id):
    info = {}
    info['geography'] = cached_geotag_count(user_mediacloud_key(), 'tags_id_media:'+str(collection_id))
    return jsonify({'results':info})

@app.route('/api/collections/<collection_id>/geography/geography.csv')
@flask_login.login_required
@api_error_handler
def collection_geo_csv(collection_id):
    return stream_geo_csv(user_mediacloud_key(), 'geography-Collection-' + collection_id, collection_id, "tags_id_media")

@app.route('/api/collections/<collection_id>/words')
@flask_login.login_required
@api_error_handler
def collection_words(collection_id):
    info = {
        'wordcounts': cached_wordcount(user_mediacloud_key, 'tags_id_media:'+str(collection_id))
    }
    return jsonify({'results':info})

@app.route('/api/collections/<collection_id>/words/wordcount.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_wordcount_csv(collection_id):
    return stream_wordcount_csv(user_mediacloud_key(), 'wordcounts-Collection-' + collection_id, collection_id, "tags_id_media")
