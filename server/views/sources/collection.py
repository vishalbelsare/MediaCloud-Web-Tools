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


@app.route('/api/collection/list', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def api_get_media_tag_list():
    tag_list = mc.tagList(tag_sets_id=5,rows=100) 
    #tag_list = sorted(tag_list, key=lambda ts: ts['label'])
    logger.info(tag_list)
    return jsonify({'results':tag_list})


@app.route('/api/collections/<media_tag_id>/details')
@flask_login.login_required
@api_error_handler 
def api_media_tag_details(media_tag_id):
    info = _get_media_tag_details(media_tag_id)
    return jsonify({'results':info})

 #Helper  
def _get_media_tag_details(media_tag_id):
    info = mc.tag(media_tag_id)
    info['id'] = media_tag_id
    info['tag_set'] = mc.tagSet(info['tag_sets_id'])
    # page through media if there are more than 100
    more_media = True
    all_media = []
    max_media_id = 0
    while(more_media):
        logging.warn("last_media_id %d" % max_media_id)
        media = mc.mediaList(tags_id=media_tag_id,last_media_id=max_media_id,rows=100)
        all_media = all_media + media
        logger.info(media)
        if len(media)>0:
            max_media_id = media[len(media)-1]['media_id']

        more_media = len(media)!=0
    info['media'] = [ {'id':m['media_id'],'name':m['name']} for m in sorted(all_media, key=lambda t: t['name']) ]
    #info['sentenceCounts'] = _recent_sentence_counts( ['media_id:'+str(media_tag_id)], start_date_str )
    return info

@app.route('/api/collections/<media_tag_id>/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def api_media_tag_sentence_count(media_tag_id):
    info = {}
    info['sentenceCounts'] = _recent_sentence_counts( ['tags_id_media:'+str(media_tag_id)] )
    return jsonify({'results':info})

@app.route('/api/collections/<media_tag_id>/sentences/sentence-count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def collection_sentence_count_csv(media_tag_id):  
    return stream_sentence_count_csv( 'sentenceCounts-Collection-' + media_tag_id, media_tag_id, "tags_id_media");
    
@app.route('/api/collections/<media_tag_id>/geography')
@flask_login.login_required
@api_error_handler 
def geo_geography(media_tag_id):
    info = {}
    info['geography'] = _geotag_count('tags_id_media:'+str(media_tag_id))
    return jsonify({'results':info})

@app.route('/api/collections/<media_tag_id>/geography/geography.csv')
@flask_login.login_required
@api_error_handler 
def collection_geo_csv(media_tag_id):  
    return stream_geo_csv( 'geography-Collection-' + media_tag_id, media_tag_id, "tags_id_media");

@app.route('/api/collections/<media_tag_id>/words')
@flask_login.login_required
@api_error_handler 
def media_tag_words(media_tag_id):
    info = {}
    info['wordcounts'] = _wordcount('tags_id_media:'+str(media_tag_id))
    return jsonify({'results':info})

@app.route('/api/collections/<media_tag_id>/words/wordcount.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler 
def collection_wordcount_csv(media_tag_id):  
    return stream_wordcount_csv( 'wordcounts-Collection-' + media_tag_id, media_tag_id, "tags_id_media");

