import logging
from flask import jsonify
import flask_login

from server import app, mc, db
from server.util.request import  api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name
logger = logging.getLogger(__name__)



def _add_user_favorite_flag_to_sources(sources):
    user_favorited = db.get_users_lists(user_name(), 'favoriteSources')
    for s in sources:
        s['isFavorite'] = int(s['media_id']) in user_favorited
    return sources

def _add_user_favorite_flag_to_collections(collections):
    user_favorited = db.get_users_lists(user_name(), 'favoriteCollections')
    for c in collections:
        c['isFavorite'] = int(c['tags_id']) in user_favorited
    return collections