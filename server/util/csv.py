import logging
import datetime
import flask

from server.auth import user_has_auth_role, ROLE_MEDIA_EDIT

SOURCES_TEMPLATE_PROPS_VIEW = ['media_id', 'url','name', 'pub_country', 'public_notes', 'is_monitored']
SOURCES_TEMPLATE_PROPS_EDIT = ['media_id', 'url','name', 'pub_country', 'public_notes', 'is_monitored', 'editor_notes']

logger = logging.getLogger(__name__)

def stream_response(data, dict_keys, filename, column_names=None, as_attachment=True):
    """Stream a fully ready dict to the user as a csv.
    Keyword arguments:
    data -- an array of dicts
    dict_keys -- the keys in each dict to build the csv out of (order is preserved)
    filename -- a string to append to the automatically generated filename for identifaction
    column_names -- (optional) column names to use, defaults to dict_keys if not specified
    """
    if (len(data) == 0):
        logger.debug("data is empty, must be asking for template")
    else:
        logger.debug("csv.stream_response with "+str(len(data))+" rows of data")
    if column_names is None:
        column_names = dict_keys
    logger.debug("  cols: "+' '.join(column_names))
    logger.debug("  props: "+' '.join(dict_keys))
    # stream back a csv
    def stream_as_csv(dataset, props, names):
        yield ','.join(names) + '\n'
        for row in dataset:
            try:
                attributes = []
                for p in props:
                    value = row[p]
                    cleaned_value = value
                    if isinstance(value, (int, long, float)):
                        cleaned_value = str(row[p])
                    elif value in ['', None]:
                        # trying to handle endode/decode problem on the other end
                        cleaned_value = ''
                    else:
                        cleaned_value = '"'+value.encode('utf-8').replace('"', '""')+'"'
                    attributes.append(cleaned_value)
                #attributes = [ csv_escape(str(row[p])) for p in props]
                yield ','.join(attributes) + '\n'
            except Exception as e:
                logger.error("Couldn't process a CSV row: "+str(e))
                logger.exception(e)
                logger.debug(row)
    download_filename = str(filename)+'_'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.csv'
    headers = {}
    if as_attachment:
        headers["Content-Disposition"] = "attachment;filename="+download_filename

    if (not len(data) == 0):
        return flask.Response(stream_as_csv(data, dict_keys, column_names),
                          mimetype='text/csv; charset=utf-8', headers=headers)
    else:
        dict_keys = ','.join(dict_keys) + '\n'
        return flask.Response(dict_keys,
                          mimetype='text/csv; charset=utf-8', headers=headers)


def api_download_sources_csv(all_media, file_prefix):

    # info = user_mc.tag(int(collection_id))
    for src in all_media:

        # handle nulls
        if 'pub_country' not in src:
            src['pub_country'] = ''
        if 'editor_notes' not in src:
            src['editor_notes'] = ''
        if 'is_monitored' not in src:
            src['is_monitored'] = ''
        if 'public_notes' not in src:
            src['public_notes'] = ''

    what_type_download = SOURCES_TEMPLATE_PROPS_EDIT

    if user_has_auth_role(ROLE_MEDIA_EDIT):
        what_type_download = SOURCES_TEMPLATE_PROPS_EDIT
    else:
        what_type_download = SOURCES_TEMPLATE_PROPS_VIEW # no editor_notes

    return stream_response(all_media, what_type_download, file_prefix, what_type_download)