import requests

from server import config

GOOGLE_NEWS_MODEL_NAME = 'GoogleNews-vectors-negative300'
TOPIC_MODEL_NAME_FORMAT = 'w2v-topic-model-{}'


def _server_url():
    return config.get('WORD_EMBEDDINGS_SERVER_URL')


def google_news_2d(words):
    try:
        response = requests.post("{}/embeddings/2d.json".format(_server_url()),
                                 data={'words[]': words,
                                       'model': GOOGLE_NEWS_MODEL_NAME})
        return response.json()['results']
    except Exception:
        return []


def topic_2d(topics_id, snapshots_id, words):
    try:
        # response = requests.post("{}/embeddings/2d.json".format(_server_url()),
        response = requests.post("{}/api/v2/topics/{}/snapshots/{}/2d".format(_server_url(), topics_id, snapshots_id),
                                 data={'words[]': words,
                                       'model': TOPIC_MODEL_NAME_FORMAT.format(topics_id)})
        response_json = response.json()
        return response_json['results']
    except Exception:
        return []
