import logging
import datetime
import flask

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
                    elif value is None:
                        cleaned_value = ""
                    else:
                        cleaned_value = '"'+value.encode('utf-8').replace('"', '""')+'"'
                    attributes.append(cleaned_value)
                #attributes = [ csv_escape(str(row[p])) for p in props]
                yield ','.join(attributes) + '\n'
            except Exception as e:
                logger.error("Couldn't process a CSV row: "+str(e))
                logger.exception(e)
                logger.debug(row)
    download_filename = 'mediacloud-'+str(filename)+'-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.csv'
    headers = {}
    if as_attachment:
        headers["Content-Disposition"] = "attachment;filename="+download_filename

    if (not len(data) == 0):
        return flask.Response(stream_as_csv(data, dict_keys, column_names),
                          mimetype='text/csv; charset=utf-8', headers=headers)
    else:
        return flask.Response(dict_keys,
                          mimetype='text/csv; charset=utf-8', headers=headers)


