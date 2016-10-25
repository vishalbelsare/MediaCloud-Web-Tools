import logging
from flask import jsonify, request
import flask_login

from server import app, mc
import server.util.csv as csv
from server.cache import cache
from server.util.request import filters_from_args, api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client

logger = logging.getLogger(__name__)

@cache
#Helper
def _wordcount(query):
    res = mc.wordCount('*',query,num_words=100,sample_size=5000)
    return res


def stream_wordcount_csv(filename, id, which):
    response = {}
    response = _wordcount(which + ":" + str(id))
    props = ['count','term', 'stem']
    return csv.stream_response(response, props,filename)