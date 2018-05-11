import logging

from server import mc
from server.views import WORD_COUNT_SAMPLE_SIZE, WORD_COUNT_UI_LENGTH, WORD_COUNT_DOWNLOAD_LENGTH
import server.util.csv as csv
from server.util.wordembeddings import google_news_2d
from server.cache import cache, key_generator
from server.auth import user_admin_mediacloud_client
from server.views.stories import QUERY_LAST_WEEK

logger = logging.getLogger(__name__)


def stream_wordcount_csv(user_mc_key, filename, query):
    response = _cached_word_count(user_mc_key, query, WORD_COUNT_DOWNLOAD_LENGTH, WORD_COUNT_SAMPLE_SIZE)
    props = ['count', 'term', 'stem']
    return csv.stream_response(response, props, filename)


def word_count(user_mc_key, query, num_words=WORD_COUNT_UI_LENGTH, sample_size=WORD_COUNT_SAMPLE_SIZE):
    return _cached_word_count(user_mc_key, query, num_words, sample_size)


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_word_count(user_mc_key, query, num_words, sample_size=WORD_COUNT_SAMPLE_SIZE):
    api_client = mc if user_mc_key is None else user_admin_mediacloud_client()
    #word_data = api_client.wordCount('*', query, num_words=num_words, sample_size=sample_size)
    words = []
    word_data = api_client.storyList('*', QUERY_LAST_WEEK, wc=True)
    for datum in word_data:
        for witem in datum['word_count']:
            words.append(witem['term'])

    word2vec_data = _cached_word2vec_google_results(words)
    try:
        for i in range(len(word2vec_data)):
            word_data[i]['google_w2v_x'] = word2vec_data[i]['x']
            word_data[i]['google_w2v_y'] = word2vec_data[i]['y']
    except KeyError as e:
        logger.warn("Didn't get valid data back from word2vec call")
        logger.exception(e)
    return word_data


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_word2vec_google_results(words):
    word2vec_results = google_news_2d(words)
    return word2vec_results
