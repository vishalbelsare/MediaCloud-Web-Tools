import logging

from server import mc
import server.util.csv as csv
from server.cache import cache
from server.auth import user_mediacloud_client

logger = logging.getLogger(__name__)

DEFAULT_NUM_WORDS = 100
DEFAULT_SAMPLE_SIZE = 5000

def stream_wordcount_csv(user_mc_key, filename, item_id, which):
    response = cached_wordcount(user_mc_key, which+":"+str(item_id), 500, 10000)
    props = ['count', 'term', 'stem']
    return csv.stream_response(response, props, filename)

@cache
def cached_wordcount(user_mc_key, query, num_words=DEFAULT_NUM_WORDS, sample_size=DEFAULT_SAMPLE_SIZE):
    api_client = mc if user_mc_key is None else user_mediacloud_client()
    res = api_client.wordCount('*', query, num_words=num_words, sample_size=sample_size)
    return res
