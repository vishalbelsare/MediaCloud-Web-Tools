import logging
from flask import jsonify, request
import flask_login
from operator import itemgetter
from mediacloud.tags import MediaTag, TAG_ACTION_ADD, TAG_ACTION_REMOVE
from werkzeug import secure_filename
import csv as pycsv
import server.util.csv as csv
import os
from server.views.sources import COLLECTIONS_TAG_SET_ID, TAG_SETS_ID_PUBLICATION_COUNTRY,  \
    COLLECTIONS_TEMPLATE_PROPS_EDIT, \
    isMetaDataTagSet, POPULAR_COLLECTION_LIST, FEATURED_COLLECTION_LIST

from server import app, mc, db
from server.util.request import arguments_required, form_fields_required, api_error_handler, json_error_response
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name
from server.util.mail import send_email
from server.views.sources.words import cached_wordcount, stream_wordcount_csv
from server.views.sources.geocount import stream_geo_csv, cached_geotag_count
from server.views.sources.sentences import cached_recent_sentence_counts, stream_sentence_count_csv
from server.views.sources.metadata import _cached_tags_in_tag_set
from server.views.sources.favorites import _add_user_favorite_flag_to_collections, _add_user_favorite_flag_to_sources

logger = logging.getLogger(__name__)

def allowed_file(filename):
    filename, file_extension = os.path.splitext(filename)
    return file_extension.lower() in ['.csv']

@app.route('/api/collections/upload-sources', methods=['POST'])
def upload_file():
    logger.debug("inside upload");
    logger.debug("request is %s", request.method)
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return json_error_response('No file part')
        uploaded_file = request.files['file']
        if uploaded_file.filename == '':
            return json_error_response('No selected file')
        if uploaded_file and allowed_file(uploaded_file.filename):
            props = COLLECTIONS_TEMPLATE_PROPS_EDIT
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(uploaded_file.filename))
            # have to save b/c otherwise we can't locate the file path (security restriction)... can delete afterwards
            uploaded_file.save(filepath)
            with open(filepath, 'rU') as f:
                reader = pycsv.DictReader(f)
                reader.fieldnames = props
                new_sources = []
                updated_only = []
                all_results = []
                reader.next()  # this means we have to have a header
                for line in reader:
                    try:
                        # python 2.7 csv module doesn't support unicode so have to do the decode/encode here for cleaned up val
                        updatedSrc = line['media_id'] not in ['', None]
                        # decode all keys as long as there is a key  re Unicode vs ascii
                        newline = {k.decode('utf-8', errors='replace').encode('ascii', errors='ignore').lower(): v for
                                   k, v in line.items() if k not in ['', None] }
                        newline_decoded = {k: v.decode('utf-8', errors='replace').encode('ascii', errors='ignore') for
                                   k, v in newline.items() if v not in ['', None] }
                        empties = {k: v for k, v in newline.items() if v in ['', None] }
                        
                        if updatedSrc:
                            newline_decoded.update(empties)
                            updated_only.append(newline_decoded)
                        else:
                            new_sources.append(newline_decoded)
                    except Exception as e:
                        logger.error("Couldn't process a CSV row: " + str(e))
                        return jsonify({'status': 'Error', 'message': "couldn't process a CSV row: " + str(e)})

                if len(new_sources) > 100:
                    return jsonify({'status': 'Error', 'message': 'Too many sources to upload. The limit is 100.'})
                else:
                    audit = []
                    if len(new_sources) > 0:
                        audit_results, successful = _create_or_update_sources_from_template(new_sources, True)
                        all_results += successful
                        audit += audit_results
                    if len(updated_only) > 0:
                        audit_results, successful = _create_or_update_sources_from_template(updated_only, False)
                        all_results += successful
                        audit += audit_results
                    _email_batch_source_update_results(audit)
                    for media in all_results:
                        media['media_id'] = int(media['media_id'])  # make sure they are ints so no-dupes logic works on front end
                    return jsonify({'results': all_results})

    return json_error_response('Something went wrong. Check your CSV file for formatting errors')

def _create_or_update_sources_from_template(source_list_from_csv, create_new):
    user_mc = user_mediacloud_client()
    successful = []
    errors = []
    logger.debug("@@@@@@@@@@@@@@@@@@@@@@")
    logger.debug("going to create or update these sources%s", source_list_from_csv)

    results = []
    for src in source_list_from_csv:
        # remove pub_country, will modify below
        source_no_meta = {k: v for k, v in src.items() if k != 'pub_country'}
        if create_new:
            temp = user_mc.mediaCreate([source_no_meta])[0]
            if temp['status'] != 'error':
                successful.append(temp)
            else:
                errors.append(temp)
            src['status'] = temp['status']
            src['status_message'] = temp['error'] if 'error' in temp else temp['status']
        else:
            media_id = src['media_id']
            source_no_meta_no_id = {k: v for k, v in source_no_meta.items() if k != 'media_id'}
            temp = user_mc.mediaUpdate(media_id, source_no_meta_no_id)
            if temp['success'] == 1:
                successful.append(src)
            else:
                errors.append(src)
            src['status'] = 'existing' if temp['success'] == 1 else 'error'
            src['status_message'] = 'unable to update existing source' if temp['success'] == 0 else 'updated existing source'
        results.append(src)

    logger.debug("successful :  %s", successful)
    logger.debug("errors :  %s", errors)
    # for new sources we have status, media_id, url, error in result, merge with source_list so we have metadata and the fields we need for the return
    if create_new:
        info_by_url = { source['url']:source for source in successful}
        for source in source_list_from_csv:
            if source['url'] in info_by_url:
                info_by_url[source['url']].update(source)
        return results, update_source_list_metadata(info_by_url)

    #if a successful update, just return what we have, success
    return results, update_source_list_metadata(successful)

def _email_batch_source_update_results(results):
    summary = "\n".join([s['url']+" - "+s['status']+" ("+s['status_message']+")" for s in results])
    content = """
Hi,

You just uploaded a bunch of sources to a collection.  By doing this, you updated or created
{count} sources.  Here is a summary of how that went.

{summary}

Sincerely,

Your friendly Media Cloud Source Manager server

https://topics.mediacloud.org
"""
    send_email('no-reply@mediacloud.org',
               [user_name()],
               '[Media Cloud] batch source update results',
               content.format(
                   count=len(results),
                   summary=summary
               ))

# this only adds/replaces metadata with values (does not remove)
def update_source_list_metadata(source_list):
    user_mc = user_mediacloud_client()
    tagISOs = _cached_tags_in_tag_set(TAG_SETS_ID_PUBLICATION_COUNTRY)
    for source in source_list:
        if 'pub_country' in source:
            metadata_tag_id = source['pub_country'] 
            if metadata_tag_id not in ['', None]:
                matching = [t for t in tagISOs if t['tag'] == 'pub_' + metadata_tag_id]
                if matching and matching not in ['', None]:
                    metadata_tag_id = matching[0]['tags_id']
                    logger.debug('found metadata to add %s', metadata_tag_id)
                    user_mc.tagMedia(
                        tags=[MediaTag(source['media_id'], tags_id=metadata_tag_id, action=TAG_ACTION_ADD)],
                        clear_others=True)  # make sure to clear any other values set in this metadata tag set
                    logger.debug("success adding metadata")
    # with the results, combine ids with metadata tag list

    # return newly created or updated source list with media_ids filled in
    return source_list


@app.route('/api/collections/<collection_id>/metadatacoverage.csv')
@flask_login.login_required
@api_error_handler
def api_metadata_download(collection_id):
    all_media = collection_media_list(user_mediacloud_key(), collection_id)

    metadata_items = []
    for each_dict in all_media:
        for eachItem in each_dict['media_source_tags']:
            if isMetaDataTagSet(eachItem['tag_sets_id']):
                found = False
                for dictItem in metadata_items:
                    if dictItem['metadataId'] == eachItem['tag_sets_id']:
                        temp = dictItem['tagged']
                        dictItem.update({'tagged': temp + 1})
                        found = True
                if not found:
                    metadata_items.append(
                        {'metadataCoverage': eachItem['tag_set'], 'metadataId': eachItem['tag_sets_id'], 'tagged': 1})

    for i in metadata_items:
        temp = len(all_media) - i['tagged']
        i.update({'notTagged': temp})

    props = ['metadataCoverage', 'tagged', 'notTagged']
    filename = "metadataCoverageForCollection" + collection_id + ".csv"
    return csv.stream_response(metadata_items, props, filename)


@app.route('/api/collections/set/<tag_sets_id>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_collection_set(tag_sets_id):
    info = _tag_set_with_public_collections(tag_sets_id)
    _add_user_favorite_flag_to_collections(info['collections'])
    return jsonify(info)

def _tag_set_with_public_collections(tag_sets_id):
    '''
    Return a list of all the public collections in a tag set.  Not cached because this can change, and load time isn't terrible.
    :param tag_sets_id: the tag set to query for public collections
    :return: dict of info and list of collections in
    '''
    user_mc = user_mediacloud_client()
    tag_set = user_mc.tagSet(tag_sets_id)
    # page through tags
    more_tags = True
    all_tags = []
    last_tags_id = 0
    while more_tags:
        tags = user_mc.tagList(tag_sets_id=tag_set['tag_sets_id'], last_tags_id=last_tags_id, rows=100, public_only=True)
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

# seems that this should have a better name- it's getting a list of sources given a list of collections...
@app.route('/api/collections/list', methods=['GET'])
@arguments_required('coll[]')
@flask_login.login_required
@api_error_handler
def api_collections_by_ids():
    collIdArray = request.args['coll[]'].split(',')
    sources_list = []
    for tagsId in collIdArray:
        all_media = collection_media_list(user_mediacloud_key(), tagsId)
        info = [{'media_id': m['media_id'], 'name': m['name'], 'url': m['url'], 'public_notes':m['public_notes']} for m in all_media]
        _add_user_favorite_flag_to_sources(info)
        sources_list += info;
    return jsonify({'results': sources_list})


@app.route('/api/collections/featured', methods=['GET'])
@api_error_handler
def api_featured_collections():
    featured_collections = _cached_featured_collections()
    return jsonify({'results': featured_collections})

@cache
def _cached_featured_collections():
    featured_collections = []
    for tagsId in FEATURED_COLLECTION_LIST:
        info = mc.tag(tagsId)
        info['id'] = tagsId
        info['wordcount'] = cached_wordcount(None, 'tags_id_media:'+str(tagsId))    # use None here to use app-level mc object
        featured_collections += [info]
    return featured_collections

@app.route('/api/collections/popular', methods=['GET'])
@api_error_handler
def api_popular_collections():
    popular_collections = _cached_popular_collections()
    sorted_popular_collections = sorted(popular_collections, key=lambda t: t['label'].lower() if t['label'] is not None else None)
    return jsonify({'results': sorted_popular_collections})

@cache
def _cached_popular_collections():
    popular_collections = []
    for tagsId in POPULAR_COLLECTION_LIST:
        info = mc.tag(tagsId)
        info['id'] = tagsId
        popular_collections += [info]
    return popular_collections

@app.route('/api/collections/<collection_id>/favorite', methods=['PUT'])
@flask_login.login_required
@form_fields_required('favorite')
@api_error_handler
def collection_set_favorited(collection_id):
    favorite = request.form["favorite"]
    username = user_name()
    if int(favorite) == 1:
        db.add_item_to_users_list(username, 'favoriteCollections', int(collection_id))
    else:
        db.remove_item_from_users_list(username, 'favoriteCollections', int(collection_id))
    return jsonify({'isFavorite': favorite})


@app.route('/api/collections/<collection_id>/details')
@flask_login.login_required
@api_error_handler
def api_collection_details(collection_id):
    user_mc = user_mediacloud_client()
    info = user_mc.tag(collection_id)
    _add_user_favorite_flag_to_collections([info])
    info['id'] = collection_id
    info['tag_set'] = _tag_set_info(user_mediacloud_key(), info['tag_sets_id'])
    all_media = collection_media_list(user_mediacloud_key(), collection_id)
    _add_user_favorite_flag_to_sources(all_media)
    info['media'] = all_media

    return jsonify({'results': info})

# either with or without editor notes
@app.route('/api/template/sources.csv')
@flask_login.login_required
@api_error_handler
def api_download_sources_template():
    filename = "Collection_Template_for_sources.csv"

    what_type_download = COLLECTIONS_TEMPLATE_PROPS_EDIT
    
    return csv.stream_response(what_type_download, what_type_download, filename)


@app.route('/api/collections/<collection_id>/sources.csv')
@flask_login.login_required
@api_error_handler
def api_collection_sources_csv(collection_id):
    user_mc = user_mediacloud_client()
    # info = user_mc.tag(int(collection_id))
    all_media = collection_media_list(user_mediacloud_key(), collection_id)
    for src in all_media:
        for tag in src['media_source_tags']:
            if isMetaDataTagSet(tag['tag_sets_id']):
                src['pub_country'] = tag['tag'][-3:]

        # handle nulls
        if 'pub_country' not in src:
            src['pub_country'] = ''
        if 'editor_notes' not in src:
            src['editor_notes'] = ''
        if 'is_monitored' not in src:
            src['is_monitored'] = ''
        if 'public_notes' not in src:
            src['public_notes'] = ''
        # if from details page, don't include editor_notes
        # src_no_editor_notes = {k: v for k, v in src.items() if k != 'editor_notes'}
    filePrefix = "Collection_Sourcelist_Template_for_" + collection_id + "_"

    what_type_download = COLLECTIONS_TEMPLATE_PROPS_EDIT

    return csv.stream_response(all_media, what_type_download, filePrefix, what_type_download)


@app.route('/api/collections/<collection_id>/sources/sentences/count')
@flask_login.login_required
@api_error_handler
def collection_source_sentence_counts(collection_id):
    results = _cached_media_with_sentence_counts(user_mediacloud_key(), collection_id)
    return jsonify({'sources': results})


@app.route('/api/collections/<collection_id>/sources/sentences/count.csv')
@flask_login.login_required
@api_error_handler
def collection_source_sentence_counts_csv(collection_id):
    user_mc = user_mediacloud_client()
    info = user_mc.tag(collection_id)
    results = _cached_media_with_sentence_counts(user_mediacloud_key(), collection_id)
    props = ['media_id', 'name', 'url', 'sentence_count', 'sentence_pct']
    filename = info['label'] + "-source sentence counts.csv"
    return csv.stream_response(results, props, filename)


@cache
def _cached_media_with_sentence_counts(user_mc_key, tag_sets_id):
    sample_size = 2000
    # list all sources first
    sources_by_id = {int(c['media_id']): c for c in collection_media_list(user_mediacloud_key(), tag_sets_id)}
    sentences = mc.sentenceList('*', 'tags_id_media:' + str(tag_sets_id), rows=sample_size, sort=mc.SORT_RANDOM)
    # sum the number of sentences per media source
    sentence_counts = {int(media_id): 0 for media_id in sources_by_id.keys()}
    if 'docs' in sentences['response']:
        for sentence in sentences['response']['docs']:
            if int(sentence['media_id']) in sentence_counts:  # safety check
                sentence_counts[int(sentence['media_id'])] = sentence_counts[int(sentence['media_id'])] + 1.
    # add in sentence count info to media info
    for media_id in sentence_counts.keys():
        sources_by_id[media_id]['sentence_count'] = sentence_counts[media_id]
        sources_by_id[media_id]['sentence_pct'] = sentence_counts[media_id] / sample_size
    return sources_by_id.values()


def _tag_set_info(user_mc_key, tag_sets_id):
    user_mc = user_mediacloud_client()
    return user_mc.tagSet(tag_sets_id)


def collection_media_list(user_mc_key, tags_id):
    more_media = True
    all_media = []
    max_media_id = 0
    while more_media:
        logger.debug("last_media_id %s", str(max_media_id))
        media = collection_media_list_page(user_mc_key, tags_id, max_media_id)
        all_media = all_media + media
        if len(media) > 0:
            max_media_id = media[len(media) - 1]['media_id']
        more_media = len(media) != 0
    return sorted(all_media, key=lambda t: t['name'])


def collection_media_list_page(user_mc_key, tags_id, max_media_id):
    '''
    We have to do this on the page, not the full list because memcache has a 1MB cache upper limit,
    and some of the collections have TONS of sources
    '''
    user_mc = user_mediacloud_client()
    return user_mc.mediaList(tags_id=tags_id, last_media_id=max_media_id, rows=100)


@app.route('/api/collections/<collection_id>/sentences/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_collection_sentence_count(collection_id):
    info = {}
    info['sentenceCounts'] = cached_recent_sentence_counts(user_mediacloud_key(),
                                                           ['tags_id_media:' + str(collection_id)])
    return jsonify({'results': info})


@app.route('/api/collections/<collection_id>/sentences/sentence-count.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_sentence_count_csv(collection_id):
    return stream_sentence_count_csv(user_mediacloud_key(), 'sentenceCounts-Collection-' + collection_id, collection_id,
                                     "tags_id_media")


@app.route('/api/collections/<collection_id>/geography')
@flask_login.login_required
@api_error_handler
def geo_geography(collection_id):
    info = {
        'geography': cached_geotag_count(user_mediacloud_key(), 'tags_id_media:' + str(collection_id))
    }
    return jsonify({'results': info})


@app.route('/api/collections/<collection_id>/geography/geography.csv')
@flask_login.login_required
@api_error_handler
def collection_geo_csv(collection_id):
    return stream_geo_csv(user_mediacloud_key(), 'geography-Collection-' + collection_id, collection_id,
                          "tags_id_media")


@app.route('/api/collections/<collection_id>/words')
@flask_login.login_required
@api_error_handler
def collection_words(collection_id):
    info = {
        'wordcounts': cached_wordcount(user_mediacloud_key, 'tags_id_media:' + str(collection_id))
    }
    return jsonify({'results': info})


@app.route('/api/collections/<collection_id>/words/wordcount.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def collection_wordcount_csv(collection_id):
    return stream_wordcount_csv(user_mediacloud_key(), 'wordcounts-Collection-' + collection_id, collection_id,
                                "tags_id_media")


@app.route('/api/collections/<collection_id>/similar-collections', methods=['GET'])
@flask_login.login_required
@api_error_handler
def similarCollections(collection_id):
    info = {}
    info['similarCollections'] = mc.tagList(similar_tags_id=collection_id)
    return jsonify({'results': info})


@app.route('/api/collections/create', methods=['POST'])
@form_fields_required('name', 'description')
@flask_login.login_required
@api_error_handler
def collection_create():
    user_mc = user_mediacloud_client()
    name = request.form['name']
    description = request.form['description']
    static = request.form['static'] if 'static' in request.form else None
    show_on_stories = request.form['showOnStories'] if 'showOnStories' in request.form else None
    show_on_media = request.form['showOnMedia'] if 'showOnMedia' in request.form else None
    source_ids = []
    if len(request.form['sources[]']) > 0:
        source_ids = request.form['sources[]'].split(',')
    # first create the collection
    new_collection = user_mc.createTag(COLLECTIONS_TAG_SET_ID, name, name, description,
                                       is_static=(static == 'true'),
                                       show_on_stories=(show_on_stories == 'true'),
                                       show_on_media=(show_on_media == 'true'))
    # then go through and tag all the sources specified with the new collection id
    tags = [MediaTag(sid, tags_id=new_collection['tag']['tags_id'], action=TAG_ACTION_ADD) for sid in source_ids]
    if len(tags) > 0:
        user_mc.tagMedia(tags)
    return jsonify(new_collection['tag'])


@app.route('/api/collections/<collection_id>/update', methods=['POST'])
@form_fields_required('name', 'description')
@flask_login.login_required
@api_error_handler
def collection_update(collection_id):
    user_mc = user_mediacloud_client()
    name = request.form['name']
    description = request.form['description']
    static = request.form['static'] if 'static' in request.form else None
    show_on_stories = request.form['showOnStories'] if 'showOnStories' in request.form else None
    show_on_media = request.form['showOnMedia'] if 'showOnMedia' in request.form else None
    source_ids = []
    if len(request.form['sources[]']) > 0:
        source_ids = [int(sid) for sid in request.form['sources[]'].split(',')]
    # first update the collection
    updated_collection = user_mc.updateTag(collection_id, name, name, description,
                                           is_static=(static == 'true'),
                                           show_on_stories=(show_on_stories == 'true'),
                                           show_on_media=(show_on_media == 'true'))
    # get the sources in the collection first, then remove and add as needed
    existing_source_ids = [int(m['media_id']) for m in collection_media_list(user_mediacloud_key(), collection_id)]
    source_ids_to_remove = list(set(existing_source_ids) - set(source_ids))
    source_ids_to_add = [sid for sid in source_ids if sid not in existing_source_ids]
    logger.debug(existing_source_ids)
    logger.debug(source_ids_to_add)
    logger.debug(source_ids_to_remove)
    # then go through and tag all the sources specified with the new collection id
    tags_to_add = [MediaTag(sid, tags_id=collection_id, action=TAG_ACTION_ADD) for sid in source_ids_to_add]
    tags_to_remove = [MediaTag(sid, tags_id=collection_id, action=TAG_ACTION_REMOVE) for sid in source_ids_to_remove]
    tags = tags_to_add + tags_to_remove
    if len(tags) > 0:
        user_mc.tagMedia(tags)
    return jsonify(updated_collection['tag'])
