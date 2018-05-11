import logging
import datetime
from operator import itemgetter
import server.util.csv as csv
from server.cache import cache, key_generator
from server.auth import user_admin_mediacloud_client

logger = logging.getLogger(__name__)


def stream_split_stories_csv(user_mc_key, filename, item_id, which):
    response = {
        'storysplits': cached_recent_split_stories(user_mc_key, [which + ":" + str(item_id)])
    }
    clean_results = [{'date': date, 'numFound': count} for date, count in response['story_splits'].iteritems()
                     if date not in ['gap', 'start', 'end']]
    clean_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'numFound']
    return csv.stream_response(clean_results, props, filename)


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_recent_split_stories(user_mc_key, q='*', fq=None):
    # Helper to fetch sentences counts over the last year for an arbitrary query
    user_mc = user_admin_mediacloud_client()
    if fq is None:
        last_n_days = 365
        start_date = datetime.date.today()-datetime.timedelta(last_n_days)
        end_date = datetime.date.today()-datetime.timedelta(1)  # yesterday
        fq = user_mc.publish_date(start_date, end_date)
    #TODO check dates - what is the default when not passed in?
    #fq= or date params?
    results = user_mc.storyCount(solr_query=q, solr_filter=fq, split=True,split_period='day')['counts']
    return results
