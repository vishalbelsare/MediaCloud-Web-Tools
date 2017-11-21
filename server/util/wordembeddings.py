import requests

from server import settings

#GOOGLE_NEWS_MODEL_NAME = 'GoogleNews-vectors-negative300.bin'
GOOGLE_NEWS_MODEL_NAME = 'w2v-topic-model-1443'


def _server_url():
    return settings.get('services', 'word_embeddings_server_url')


def google_news_2d(words):
    try:
        response = requests.post("{}/embeddings/2d.json".format(_server_url()),
                                 data={'words[]': words,
                                   'model': GOOGLE_NEWS_MODEL_NAME})
        return response.json()['results']
    except Exception:
        return []
