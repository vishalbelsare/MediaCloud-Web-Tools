import logging
import flask_login
import time
from flask import request, jsonify, render_template
from mediacloud.tags import MediaTag, TAG_ACTION_ADD, TAG_ACTION_REMOVE
from server.util.mail import send_html_email
from werkzeug.utils import secure_filename

from server import app
from server.auth import user_admin_mediacloud_client, user_mediacloud_key, user_name
from server.util.request import json_error_response, form_fields_required, api_error_handler
from server.views.sources.collection import collection_media_list, allowed_file
from server.views.sources import COLLECTIONS_TEMPLATE_PROPS_EDIT
from server.util.tags import VALID_METADATA_IDS, METADATA_PUB_STATE_NAME, METADATA_PUB_COUNTRY_NAME, format_name_from_label
from server.views.sources.metadata import cached_tags_in_tag_set

logger = logging.getLogger(__name__)


@app.route('/api/collections/<collection_id>/update', methods=['POST'])
@form_fields_required('name', 'description')
@flask_login.login_required
@api_error_handler
def collection_update(collection_id):
    user_mc = user_admin_mediacloud_client()
    label = '{}'.format(request.form['name'])
    description = request.form['description']
    static = request.form['static'] if 'static' in request.form else None
    show_on_stories = request.form['showOnStories'] if 'showOnStories' in request.form else None
    show_on_media = request.form['showOnMedia'] if 'showOnMedia' in request.form else None

    formatted_name = format_name_from_label(label)

    source_ids = []
    if len(request.form['sources[]']) > 0:
        source_ids = [int(sid) for sid in request.form['sources[]'].split(',')]
    # first update the collection
    updated_collection = user_mc.updateTag(collection_id, formatted_name, label, description,
                                           is_static=(static == 'true'),
                                           show_on_stories=(show_on_stories == 'true'),
                                           show_on_media=(show_on_media == 'true'))
    # get the sources in the collection first, then remove and add as needed
    existing_source_ids = [int(m['media_id']) for m in collection_media_list(user_mediacloud_key(), collection_id)]
    source_ids_to_remove = list(set(existing_source_ids) - set(source_ids))
    source_ids_to_add = [sid for sid in source_ids if sid not in existing_source_ids]
    #logger.debug(existing_source_ids)
    #logger.debug(source_ids_to_add)
    #logger.debug(source_ids_to_remove)
    # then go through and tag all the sources specified with the new collection id
    tags_to_add = [MediaTag(sid, tags_id=collection_id, action=TAG_ACTION_ADD) for sid in source_ids_to_add]
    tags_to_remove = [MediaTag(sid, tags_id=collection_id, action=TAG_ACTION_REMOVE) for sid in source_ids_to_remove]
    tags = tags_to_add + tags_to_remove
    if len(tags) > 0:
        user_mc.tagMedia(tags)
    return jsonify(updated_collection['tag'])


@app.route('/api/collections/upload-sources', methods=['POST'])
def upload_file():
    time_start = time.time()
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
                all_errors = []
                reader.next()  # this means we have to have a header
                for line in reader:
                    try:
                        # python 2.7 csv module doesn't support unicode so have to do the decode/encode here for cleaned up val
                        updatedSrc = line['media_id'] not in ['', None]
                        # decode all keys as long as there is a key  re Unicode vs ascii
                        newline = {k.decode('utf-8', errors='replace').encode('ascii', errors='ignore').lower(): v for
                                   k, v in line.items() if k not in ['', None]}
                        newline_decoded = {k: v.decode('utf-8', errors='replace').encode('ascii', errors='ignore') for
                                           k, v in newline.items() if v not in ['', None]}
                        empties = {k: v for k, v in newline.items() if v in ['', None]}

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
                        audit_results, successful, errors = _create_or_update_sources_from_template(new_sources, True)
                        all_results += successful
                        audit += audit_results
                        all_errors += errors
                    if len(updated_only) > 0:
                        audit_results, successful, errors = _create_or_update_sources_from_template(updated_only, False)
                        all_results += successful
                        audit += audit_results
                        all_errors += errors
                    if settings.has_option('smtp', 'enabled'):
                        mail_enabled = settings.get('smtp', 'enabled')
                        if mail_enabled is '1':
                            _email_batch_source_update_results(audit)
                    for media in all_results:
                        if 'media_id' in media:
                            media['media_id'] = int(
                                media['media_id'])  # make sure they are ints so no-dupes logic works on front end
                    time_end = time.time()
                    logger.info("upload_file: %d".format(time_start - time_end))
                    return jsonify({'results': all_results})

    return json_error_response('Something went wrong. Check your CSV file for formatting errors')


def _create_or_update_sources_from_template(source_list_from_csv, create_new):
    user_mc = user_admin_mediacloud_client()
    successful = []
    errors = []
    logger.debug("@@@@@@@@@@@@@@@@@@@@@@")
    logger.debug("going to create or update these sources%s", source_list_from_csv)

    results = []
    for src in source_list_from_csv:
        # remove metadata for now, will modify below
        # we take out primary_language and subject_country BTW and ignore it
        source_no_meta = {k: v for k, v in src.items() if
                          k != 'pub_country' and k != 'pub_state' and k != 'primary_language' and k != 'subject_country'}
        if create_new:
            temp = user_mc.mediaCreate([source_no_meta])[0]
            src['status'] = 'found and updated this source' if temp['status'] == 'existing' else temp['status']
            if 'error' in temp:
                src['status_message'] = temp['error']
            else:
                src['status_message'] = src['status']
            if temp['status'] != 'error':
                successful.append(src)
            else:
                errors.append(src)
        else:
            media_id = src['media_id']
            source_no_meta_no_id = {k: v for k, v in source_no_meta.items() if k != 'media_id'}
            temp = user_mc.mediaUpdate(media_id, source_no_meta_no_id)
            src['status'] = 'existing' if temp['success'] == 1 else 'error'
            src['status_message'] = 'unable to update existing source' if temp[
                                                                              'success'] == 0 else 'updated existing source'
            if temp['success'] == 1:
                successful.append(src)
            else:
                errors.append(src)

        results.append(src)

    logger.debug("successful :  %s", successful)
    logger.debug("errors :  %s", errors)
    # for new sources we have status, media_id, url, error in result, merge with source_list so we have metadata and the fields we need for the return
    if create_new:
        info_by_url = {source['url']: source for source in successful}
        for source in source_list_from_csv:
            if source['url'] in info_by_url:
                info_by_url[source['url']].update(source)
        return results, update_source_list_metadata(info_by_url), errors

    # if a successful update, just return what we have, success
    return results, update_source_list_metadata(successful), errors


def _email_batch_source_update_results(audit_feedback):
    email_title = "Source Batch Updates "
    content_title = "You just uploaded {} sources to a collection.".format(len(audit_feedback))
    updated_sources = []
    for updated in audit_feedback:
        updated_sources.append(updated)

    content_body = updated_sources
    action_text = "Login to Media Cloud"
    action_url = "https://sources.mediacloud.org/#/login"
    # send an email confirmation
    send_html_email(email_title,
                    [user_name(), 'noreply@mediacloud.org'],
                    render_template("emails/source_batch_upload_ack.txt",
                                    content_title=content_title, content_body=content_body, action_text=action_text,
                                    action_url=action_url),
                    render_template("emails/source_batch_upload_ack.html",
                                    email_title=email_title, content_title=content_title, content_body=content_body,
                                    action_text=action_text, action_url=action_url)
                    )


# this only adds/replaces metadata with values (does not remove)
def update_source_list_metadata(source_list):
    user_mc = user_admin_mediacloud_client()

    for m in VALID_METADATA_IDS:
        mid = m.values()[0]
        mkey = m.keys()[0]
        tag_codes = cached_tags_in_tag_set(mid)
        for source in source_list:
            if mkey in source:
                metadata_tag_name = source[mkey]
                if metadata_tag_name not in ['', None]:
                    # hack until we have a better match check
                    matching = []
                    if mkey == METADATA_PUB_COUNTRY_NAME:  # template pub_###
                        matching = [t for t in tag_codes if t['tag'] == 'pub_' + metadata_tag_name]
                    elif mkey == METADATA_PUB_STATE_NAME:  # template ###_##
                        matching = [t for t in tag_codes if t['tag'] == metadata_tag_name]

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
