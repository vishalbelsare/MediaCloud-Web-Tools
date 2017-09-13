import logging

from server import mc
import server.util.csv as csv
from server.util.wordembeddings import google_news_2d
from server.cache import cache
from server.auth import user_admin_mediacloud_client

logger = logging.getLogger(__name__)

DEFAULT_NUM_WORDS = 100
DEFAULT_SAMPLE_SIZE = 5000


def stream_wordcount_csv(user_mc_key, filename, query):
    response = cached_wordcount(user_mc_key, query, 500, 10000)
    props = ['count', 'term', 'stem']
    return csv.stream_response(response, props, filename)


@cache
def cached_wordcount(user_mc_key, query, num_words=DEFAULT_NUM_WORDS, sample_size=DEFAULT_SAMPLE_SIZE):
    api_client = mc if user_mc_key is None else user_admin_mediacloud_client()
    word_data = api_client.wordCount('*', query, num_words=num_words, sample_size=sample_size)
    words = [w['term'] for w in word_data]
    word2vec_data = _cached_word2vec_google_results(words)
    try:
        for i in range(len(word2vec_data)):
            word_data[i]['google_w2v_x'] = word2vec_data[i]['x']
            word_data[i]['google_w2v_y'] = word2vec_data[i]['y']
    except KeyError as e:
        logger.warn("Didn't get valid data back from word2vec call")
        logger.exception(e)
    return word_data


@cache
def _cached_word2vec_google_results(words):
    word2vec_results = google_news_2d(words)
    return word2vec_results
