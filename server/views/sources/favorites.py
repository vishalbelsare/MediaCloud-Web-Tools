import logging
from flask import jsonify
import flask_login
import server.util.csv as csv
from server import app, mc, db
from server.util.request import  api_error_handler
from server.cache import cache
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_name
from server.views.sources import download_sources_csv
logger = logging.getLogger(__name__)



def add_user_favorite_flag_to_sources(sources):
    user_favorited = db.get_users_lists(user_name(), 'favoriteSources')
    for s in sources:
        s['isFavorite'] = int(s['media_id']) in user_favorited
    return sources

def add_user_favorite_flag_to_collections(collections):
    user_favorited = db.get_users_lists(user_name(), 'favoriteCollections')
    for c in collections:
        c['isFavorite'] = int(c['tags_id']) in user_favorited
    return collections

@app.route('/api/favorites/collections', methods=['GET'])
@flask_login.login_required
@api_error_handler
def favorite_collections():
    user_mc = user_admin_mediacloud_client()
    user_favorited = db.get_users_lists(user_name(), 'favoriteCollections')
    favorited_collections = [user_mc.tag(tag_id) for tag_id in user_favorited]
    for s in favorited_collections:
        s['isFavorite'] = True
    return jsonify({'list': favorited_collections})

@app.route('/api/favorites/collections.csv')
@flask_login.login_required
@api_error_handler
def download_favorite_collections():
    colllist = favorite_collections()

    filename = "FavoriteCollections.csv"
    return csv.stream_response(colllist, props, filename)

@app.route('/api/favorites/sources.csv')
@flask_login.login_required
@api_error_handler
def download_favorite_sources():
    user_mc = user_admin_mediacloud_client()
    user_favorited = db.get_users_lists(user_name(), 'favoriteSources')
    favorited_s = [user_mc.media(media_id) for media_id in user_favorited]
    for s in favorited_s:
        s['isFavorite'] = True

    filename = "FavoriteSources.csv"
    return download_sources_csv( favorited_s, filename)


@app.route('/api/favorites/sources', methods=['GET'])
@flask_login.login_required
@api_error_handler
def favorite_sources():
    user_mc = user_admin_mediacloud_client()
    user_favorited = db.get_users_lists(user_name(), 'favoriteSources')
    favorited_s = [user_mc.media(media_id) for media_id in user_favorited]
    for s in favorited_s:
        s['isFavorite'] = True
    return jsonify({'list': favorited_s})