import logging
import datetime
import flask

logger = logging.getLogger(__name__)


def _file_name_timestamp():
    return datetime.datetime.now().strftime(u'%Y%m%d%H%M%S')


def safe_filename(name):
    return u"{}_{}.csv".format(name, _file_name_timestamp())


def dict2row(keys_to_include, dict_row):
    attributes = []
    try:
        for k in keys_to_include:
            value = dict_row[k]
            if isinstance(value, (int, long, float)):
                cleaned_value = str(dict_row[k])
            elif value in ['', None]:
                cleaned_value = u''
            else:
                cleaned_value = u'"' + value.replace(u'"', u'""') + u'"'
            attributes.append(cleaned_value)
    except Exception as e:
        logger.error(u"Couldn't process a CSV row: " + str(e))
        logger.exception(e)
        logger.debug(dict_row)
    return attributes


def stream_response(data, dict_keys, filename, column_names=None, as_attachment=True):
    """Stream a fully ready dict to the user as a csv.
    Keyword arguments:
    data -- an array of dicts
    dict_keys -- the keys in each dict to build the csv out of (order is preserved)
    filename -- a string to append to the automatically generated filename for identifaction
    column_names -- (optional) column names to use, defaults to dict_keys if not specified
    """
    if len(data) == 0:
        logger.debug(u"data is empty, must be asking for template")
    else:
        logger.debug(u"csv.stream_response with "+str(len(data))+" rows of data")
    if column_names is None:
        column_names = dict_keys
    logger.debug(u"  cols: "+' '.join(column_names))
    logger.debug(u"  props: "+' '.join(dict_keys))

    # stream back a csv
    def stream_as_csv(dataset, props, names):
        yield ','.join(names) + '\n'
        for dict_row in dataset:
            cleaned_row = dict2row(props, dict_row)
            yield ','.join(cleaned_row) + '\n'
    download_filename = safe_filename(filename)
    headers = {}
    if as_attachment:
        headers["Content-Disposition"] = "attachment;filename="+download_filename

    if not len(data) == 0:
        return flask.Response(stream_as_csv(data, dict_keys, column_names),
                              mimetype='text/csv; charset=utf-8', headers=headers)
    else:
        dict_keys = ','.join(dict_keys) + '\n'
        return flask.Response(dict_keys,
                              mimetype='text/csv; charset=utf-8', headers=headers)

def download_media_csv(all_media, file_prefix, what_type_download):

    # info = user_mc.tag(int(collection_id))
    for src in all_media:
        if 'editor_notes' in what_type_download and 'editor_notes' not in src:
            src['editor_notes'] = ''
        if 'is_monitored' in what_type_download and 'is_monitored' not in src:
            src['is_monitored'] = ''
        if 'public_notes' in what_type_download and 'public_notes' not in src:
            src['public_notes'] = ''
        # handle nulls
        if 'pub_country' not in src:
            src['pub_country'] = ''
        if 'pub_state' not in src:
            src['pub_state'] = ''
        if 'primary_language' not in src:
            src['primary_language'] = ''
        if 'subject_country' not in src:
            src['subject_country'] = ''
        if 'media_type' not in src:
            src['media_type'] = ''

    return stream_response(all_media, what_type_download, file_prefix, what_type_download)

