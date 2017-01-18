# -*- coding: utf-8 -*-
import logging
from flask import request, jsonify
import flask_login
from datetime import datetime
from dateutil.relativedelta import relativedelta
from mediacloud.tags import MediaTag, TAG_ACTION_ADD, TAG_ACTION_REMOVE

from server import app, db
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name
from server.util.mail import send_email
from server.util.request import arguments_required, form_fields_required, api_error_handler
from server.views.sources import COLLECTIONS_TAG_SET_ID, GV_TAG_SET_ID, EMM_TAG_SET_ID, TAG_SETS_ID_PUBLICATION_COUNTRY
from server.views.sources.words import cached_wordcount, stream_wordcount_csv
from server.views.sources.geocount import stream_geo_csv, cached_geotag_count
from server.views.sources.sentences import cached_recent_sentence_counts, stream_sentence_count_csv
from server.views.sources.feeds import stream_feed_csv, source_feed_list

logger = logging.getLogger(__name__)


@app.route('/api/sources/list', methods=['GET'])
@arguments_required('src[]')
@flask_login.login_required
@api_error_handler
def api_media_sources_by_ids():
    source_list = []
    source_id_array = request.args['src[]'].split(',')
    for mediaId in source_id_array:
        info = _cached_media_source_details(user_mediacloud_key(), mediaId)
        source_list.append(info)
    return jsonify({'results': source_list})


@app.route('/api/sources/<media_id>/favorite', methods=['POST'])
@flask_login.login_required
@form_fields_required('favorite')
@api_error_handler
def source_set_favorited(media_id):
    favorite = request.form["favorite"]
    username = user_name()
    if int(favorite) == 1:
        db.add_item_to_users_list(username, 'favoriteSources', int(media_id))
    else:
        db.remove_item_from_users_list(username, 'favoriteSources', int(media_id))
    return jsonify({'isFavorite': favorite})

def _add_user_favorite_flag_to_sources(sources):
    user_favorited = db.get_users_lists(user_name(), 'favoriteSources')
    for s in sources:
        s['isFavorite'] = int(s['media_id']) in user_favorited
    return sources

@app.route('/api/sources/<media_id>/feeds', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_source_feed(media_id):
    feed_list = source_feed_list(media_id)
    feed_count = len(feed_list)
    return jsonify({'results': feed_list, 'count': feed_count})


@app.route('/api/sources/<media_id>/feeds/feeds.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_feed_csv(media_id):
    return stream_feed_csv('feeds-Source-' + media_id, media_id)


@cache
def _cached_media_source_health(user_mc_key, media_id):
    user_mc = user_mediacloud_client()
    results = None
    try:
        results = user_mc.mediaHealth(media_id)
    except Exception as e:
        logger.exception(e)
    return results


def _cached_media_source_details(user_mc_key, media_id, start_date_str=None):
    user_mc = user_mediacloud_client()
    info = user_mc.media(media_id)
    info['id'] = media_id
    info['feedCount'] = len(user_mc.feedList(media_id=media_id, rows=100))
    return info


def _safely_get_health_start_date(health):
    """
    The health might be empty, so call this to default to 1 year ago if it is
    """
    if health is None:  # maybe no health exists yet, go with one year ago
        one_year_ago = datetime.now() - relativedelta(years=1)
        start_date = "{0}-{1}-{2}".format(one_year_ago.year, one_year_ago.month, one_year_ago.day)
    else:
        start_date = health['start_date'][:10]
    return start_date


@app.route('/api/sources/<media_id>/details')
@flask_login.login_required
@api_error_handler
def api_media_source_details(media_id):
    health = _cached_media_source_health(user_mediacloud_key(), media_id)
    info = _cached_media_source_details(user_mediacloud_key(), media_id,
                                        _safely_get_health_start_date(health))
    info['health'] = health
    _add_user_favorite_flag_to_sources([info])
    return jsonify({'results': info})


@app.route('/api/sources/<media_id>/sentences/sentence-count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_sentence_count_csv(media_id):
    return stream_sentence_count_csv(user_mediacloud_key(), 'sentenceCounts-Source-' + media_id, media_id, "media_id")


@app.route('/api/sources/<media_id>/sentences/count')
@flask_login.login_required
@api_error_handler
def api_media_source_sentence_count(media_id):
    health = _cached_media_source_health(user_mediacloud_key(), media_id)
    info = {
        'health': health,
        'sentenceCounts': cached_recent_sentence_counts(user_mediacloud_key(),
            ['media_id:'+str(media_id)],
            _safely_get_health_start_date(health))
    }
    return jsonify({'results':info})


@app.route('/api/sources/<media_id>/geography')
@flask_login.login_required
@api_error_handler
def api_media_source_geography(media_id):
    info = {
        'geography': cached_geotag_count(user_mediacloud_key(), 'media_id:'+str(media_id))
    }
    return jsonify({'results': info})


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
    return jsonify({'results': info})


@app.route('/api/sources/create', methods=['POST'])
@form_fields_required('name', 'url')
@flask_login.login_required
@api_error_handler  
def source_create():
    user_mc = user_mediacloud_client()
    name = request.form['name']
    url = request.form['url']
    notes = request.form['notes'] if 'notes' in request.form else None    # this is optional
    public_notes = request.form['publicNotes'] if 'publicNotes' in request.form else None
    monitored = request.form['monitored'] if 'monitored' in request.form else None
    # parse out any tag to add (ie. collections and metadata)
    tag_ids_to_add = []
    if len(request.form['collections[]']) > 0:
        tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",")]
    valid_metadata = [
        {'form_key': 'publicationCountry', 'tag_sets_id': TAG_SETS_ID_PUBLICATION_COUNTRY}
    ]
    source_to_create = {
        'name': name,
        'url': url,
        'editor_notes': notes,
        'tags_ids': tag_ids_to_add
    }
    result = user_mc.mediaCreate([source_to_create])[0]  # need just the first entry, since we only create one
    if result['status'] != "error":
        # if it worked, update any metadata, because we need to remove the other tags in each set
        for metadata_item in valid_metadata:
            metadata_tag_id = request.form[metadata_item['form_key']] if metadata_item['form_key'] in request.form else None  # this is optional
            if metadata_tag_id:
                user_mc.tagMedia(
                    tags=[MediaTag(result['media_id'], tags_id=metadata_tag_id, action=TAG_ACTION_ADD)],
                    clear_others=True)   # make sure to clear any other values set in this metadata tag set
                tag_ids_to_add.append(metadata_tag_id)
    return jsonify(result)


@app.route('/api/sources/<media_id>/update', methods=['POST'])
@form_fields_required('name', 'url')
@flask_login.login_required
@api_error_handler  
def source_update(media_id):
    user_mc = user_mediacloud_client()
    # update the basic info
    name = request.form['name']
    url = request.form['url']
    notes = request.form['notes'] if 'notes' in request.form else None  # this is optional
    public_notes = request.form['publicNotes'] if 'publicNotes' in request.form else None
    monitored = request.form['monitored'] if 'monitored' in request.form else None
    result = user_mc.mediaUpdate(media_id, url=url, name=name, editor_notes=notes)


    # now we need to update the collections separately, because they are tags on the media source
    source = user_mc.media(media_id)
    existing_tag_ids = [t['tags_id'] for t in source['media_source_tags']
        if t['tag_sets_id'] in [COLLECTIONS_TAG_SET_ID, GV_TAG_SET_ID, EMM_TAG_SET_ID]]
    tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",")]
    tag_ids_to_remove = list(set(existing_tag_ids) - set(tag_ids_to_add))
    tags_to_add = [MediaTag(media_id, tags_id=cid, action=TAG_ACTION_ADD)
                   for cid in tag_ids_to_add if cid not in existing_tag_ids]
    tags_to_remove = [MediaTag(media_id, tags_id=cid, action=TAG_ACTION_REMOVE) for cid in tag_ids_to_remove]
    tags = tags_to_add + tags_to_remove
    if len(tags) > 0:   # don't make extraneous calls
        user_mc.tagMedia(tags=tags)
    # now update the metadata too
    valid_metadata = [
        {'form_key': 'publicationCountry', 'tag_sets_id': TAG_SETS_ID_PUBLICATION_COUNTRY}
    ]
    for metadata_item in valid_metadata:
        metadata_tag_id = request.form[metadata_item['form_key']] if metadata_item['form_key'] in request.form else None # this is optional
        existing_tag_ids = [t['tags_id'] for t in source['media_source_tags']
            if t['tag_sets_id'] == TAG_SETS_ID_PUBLICATION_COUNTRY]
        if metadata_tag_id is None:
            # we want to remove it if there was one there
            if len(existing_tag_ids) > 0:
                tag = MediaTag(media_id, tags_id=existing_tag_ids[0], action=TAG_ACTION_REMOVE)
                user_mc.tagMedia([tag])
        elif metadata_tag_id not in existing_tag_ids:
            # need to add it and clear out the other
            tag = MediaTag(media_id, tags_id=metadata_tag_id, action=TAG_ACTION_ADD)
            user_mc.tagMedia([tag], clear_others=True)
    # result the success of the media update call - would be better to catch errors in any of these calls...
    return jsonify(result)


@app.route('/api/sources/suggestions', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_suggestions():
    user_mc = user_mediacloud_client()
    show_all = request.args['all'] == '1' if 'all' in request.args else False
    suggestions = user_mc.mediaSuggestionsList(all=show_all)
    return jsonify({'list': suggestions})


@app.route('/api/sources/suggestions/<suggestion_id>/update', methods=['POST'])
@form_fields_required('status', 'reason')
@flask_login.login_required
@api_error_handler
def source_suggestion_update(suggestion_id):
    user_mc = user_mediacloud_client()
    status = request.form['status']
    reason = request.form['reason']
    results = user_mc.mediaSuggestionsMark(suggestion_id, status, reason)
    return jsonify(results)


@app.route('/api/sources/suggestions/submit', methods=['POST'])
@form_fields_required('url')
@flask_login.login_required
@api_error_handler
def source_suggest():
    user_mc = user_mediacloud_client()
    url = request.form['url']
    feed_url = request.form['feedurl'] if 'feedurl' in request.form else None
    name = request.form['name'] if 'name' in request.form else None
    reason = request.form['reason'] if 'reason' in request.form else None
    tag_ids_to_add = []
    if len(request.form['collections[]']) > 0:
        tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",")]
    new_suggestion = user_mc.mediaSuggest(url=url, name=name, feed_url=feed_url, reason=reason,
                                          collections=tag_ids_to_add)
    content = """
Hi,

{username} just suggested a new source to add to Media Cloud:

url: {url}

Name: {name}

Feed URL: {feed_url}

Reason: {reason}

Sincerely,

Your friendly Media Cloud Source Manager server
🎓👓

https://sources.mediacloud.org
"""
    send_email('no-reply@mediacloud.org',
               [user_name(), 'source-suggestion@mediacloud.org'],
               'New Topic Request: ' + request.form['name'],
               content.format(
                   username=user_name(),
                   name=name,
                   url=url,
                   feed_url=feed_url,
                   reason=reason
               ))
    return jsonify(new_suggestion)

@app.route('/api/sources/favorite', methods=['GET'])
@flask_login.login_required
@api_error_handler
def favorite_sources():
    user_mc = user_mediacloud_client()
    user_favorited = db.get_users_lists(user_name(), 'favoriteSources')
    favorited_sources = [user_mc.media(media_id) for media_id in user_favorited]
    for s in favorited_sources:
        s['isFavorite'] = True
    return jsonify({'sources': favorited_sources})

