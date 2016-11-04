import logging
import datetime
from operator import itemgetter
import server.util.csv as csv
from server.cache import cache
from server.auth import user_mediacloud_client

logger = logging.getLogger(__name__)

def stream_sentence_count_csv(user_mc_key, filename, item_id, which):
    response = {}
    response['sentencecounts'] = cached_recent_sentence_counts(user_mc_key, [which + ":" +str(item_id)])
    clean_results = [{'date': date, 'numFound': count} for date, count in response['sentencecounts'].iteritems() if date not in ['gap', 'start', 'end']]
    clean_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'numFound']
    return csv.stream_response(clean_results, props, filename)

@cache
def cached_recent_sentence_counts(user_mc_key, fq, start_date_str=None):
    '''
    Helper to fetch sentences counts over the last year for an arbitrary query
    '''
    user_mc = user_mediacloud_client()
    if start_date_str is None:
        last_n_days = 365
        start_date = datetime.date.today()-datetime.timedelta(last_n_days)
    else:
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d')    # throws value error if incorrectly formatted
    yesterday = datetime.date.today()-datetime.timedelta(1)
    fq.append(user_mc.publish_date_query(start_date, yesterday))
    sentences_over_time = user_mc.sentenceCount('*', solr_filter=fq, split=True,
        split_start_date=datetime.datetime.strftime(start_date, '%Y-%m-%d'),
        split_end_date=datetime.datetime.strftime(yesterday, '%Y-%m-%d'))['split']
    return sentences_over_time
