# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, mc
from server.cache import cache
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_name, user_has_auth_role, \
    is_user_logged_in, ROLE_MEDIA_EDIT
from server.views.sources import FEATURED_COLLECTION_LIST
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.views.explorer import solr_query_from_request, read_sample_searches
from operator import itemgetter

logger = logging.getLogger(__name__)

### MAY NOT BE A FORM TODO

@app.route('/api/explorer/sample-searches', methods=['GET'])
@api_error_handler
def api_explorer_sample_searches():
    return read_sample_searches()

@app.route('/api/explorer/sources/list', methods=['GET'])
@arguments_required('sources[]')
@api_error_handler
def api_explorer_sources_by_ids():
    # TODO do logged in check and use same code path?
    source_list = []
    source_id_array = request.args['sources[]'].split(',')
    for mediaId in source_id_array:
        info = mc.media(mediaId)
        info['id'] = mediaId
        source_list.append(info)
    return jsonify(source_list)

@app.route('/api/explorer/collections/list', methods=['GET'])
@arguments_required('collections[]')
@api_error_handler
def api_explorer_demo_collections_by_ids():
    collIdArray = request.args['collections[]'].split(',')
    coll_list = []
    for tagsId in collIdArray:
        info = mc.tag(tagsId) # TODO need to change this to user_mc and handle return val
        info['id'] = int(tagsId)
        # info['tag_set'] = _tag_set_info(mc, info['tag_sets_id'])
        coll_list.append(info);
    return jsonify(coll_list)


@app.route('/api/explorer/demo/sources/list', methods=['GET'])
@arguments_required('sources[]')
@api_error_handler
def api_explorer_demo_sources_by_ids():
    source_list = []
    source_id_array = request.args['sources[]'].split(',')
    for mediaId in source_id_array:
        info = mc.media(mediaId)
        info['id'] = int(mediaId)
        source_list.append(info)
    return jsonify(source_list)

@app.route('/api/explorer/demo/collections/list', methods=['GET'])
@arguments_required('collections[]')
@api_error_handler
def api_explorer_collections_by_ids():
    collIdArray = request.args['collections[]'].split(',')
    coll_list = []
    for tagsId in collIdArray:
        info = mc.tag(tagsId)
        info['id'] = tagsId
        # info['tag_set'] = _tag_set_info(mc, info['tag_sets_id'])
        coll_list.append(info);
    return jsonify(coll_list)

@app.route('/api/mediapicker/collections/featured', methods=['GET'])
@api_error_handler
def api_explorer_featured_collections():
    featured_collections = _cached_featured_collections()
    return jsonify({'results': featured_collections})


@cache
# if details is true, add story count, source count also
def _cached_featured_collections():
    featured_collections = []
    for tagsId in FEATURED_COLLECTION_LIST:
        info = mc.tag(tagsId)
        info['id'] = tagsId
        # info['wordcount'] = cached_wordcount(None, 'tags_id_media:' + str(tagsId))  # use None here to use app-level mc object
        featured_collections += [info]
    return featured_collections


# TODO maybe remove
@app.route('/api/explorer/set/<tag_sets_id>', methods=['GET'])
@api_error_handler
def api_explorer_collection_set(tag_sets_id):
    '''
    Return a list of all the (public only or public and private, depending on user role) collections in a tag set.  Not cached because this can change, and load time isn't terrible.
    :param tag_sets_id: the tag set to query for public collections
    :return: dict of info and list of collections in
    '''
    info = []
    if is_user_logged_in() and user_has_auth_role(ROLE_MEDIA_EDIT) == True:
        info = _tag_set_with_private_collections(tag_sets_id)
    else:
        info = _tag_set_with_public_collections(tag_sets_id)

    #_add_user_favorite_flag_to_collections(info['collections'])
    return jsonify(info)

def _tag_set_with_collections(tag_sets_id, show_only_public_collections):

    # TODO use which mc or user_mc here
    tag_set = mc.tagSet(tag_sets_id)
    # page through tags
    more_tags = True
    all_tags = []
    last_tags_id = 0
    while more_tags:
        tags = mc.tagList(tag_sets_id=tag_set['tag_sets_id'], last_tags_id=last_tags_id, rows=100, public_only=show_only_public_collections)
        all_tags = all_tags + tags
        if len(tags) > 0:
            last_tags_id = tags[-1]['tags_id']
        more_tags = len(tags) != 0
    collection_list = [t for t in all_tags if t['show_on_media'] is 1]  # double check the show_on_media because that controls public or not
    collection_list = sorted(collection_list, key=itemgetter('label'))
    return {
        'name': tag_set['label'],
        'description': tag_set['description'],
        'collections': collection_list
    }

def _tag_set_with_private_collections(tag_sets_id):
    return _tag_set_with_collections(tag_sets_id, False)


def _tag_set_with_public_collections(tag_sets_id):
    return _tag_set_with_collections(tag_sets_id, True)


@app.route('/api/explorer/words/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_word_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = solr_query_from_request(request.form)    
    word_count_result = user_mc.wordCount(solr_query=solr_query)

    return jsonify(word_count_result)  # give them back new data, so they can update the client


@app.route('/api/explorer/themes', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_explorer_themes():
    return jsonify()

