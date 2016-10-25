import logging, datetime
from flask import jsonify, request
import flask_login
from operator import itemgetter

from server import app, mc
import server.util.csv as csv
from server.cache import cache
from server.util.request import filters_from_args, api_error_handler, json_error_response
from server.auth import user_mediacloud_key, user_mediacloud_client


logger = logging.getLogger(__name__)



def stream_sentence_count_csv(filename, id, which):
    response = {}
    response['sentencecounts'] = _recent_sentence_counts( [which + ":" +str(id)] )  
    clean_results = [{'date': date, 'numFound': count} for date, count in response['sentencecounts'].iteritems() if date not in ['gap', 'start', 'end']]
    props = ['date', 'numFound']
    logging.warn(response['sentencecounts'])
    logging.info(clean_results)
    return csv.stream_response(clean_results, props,filename)


@cache
def _recent_sentence_counts(fq, start_date_str=None):
    '''
    Helper to fetch sentences counts over the last year for an arbitrary query
    '''
    if start_date_str is None:
        last_n_days = 365
        start_date = datetime.date.today()-datetime.timedelta(last_n_days)
    else:
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d')    # throws value error if incorrectly formatted
    yesterday = datetime.date.today()-datetime.timedelta(1)
    fq.append( mc.publish_date_query(start_date,yesterday) )
    sentences_over_time = mc.sentenceCount('*', solr_filter=fq, split=True,
        split_start_date=datetime.datetime.strftime(start_date,'%Y-%m-%d'),
        split_end_date=datetime.datetime.strftime(yesterday,'%Y-%m-%d'))['split']
    return sentences_over_time
##??