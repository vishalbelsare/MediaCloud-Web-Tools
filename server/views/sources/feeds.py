import logging
from flask import request, jsonify
import flask_login

from server import app
import server.util.csv as csv
from server.auth import user_mediacloud_client
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)


@app.route('/api/sources/<media_id>/feeds', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_source_feed(media_id):
    feed_list = source_feed_list(media_id)
    feed_count = len(feed_list)
    return jsonify({'results': feed_list, 'count': feed_count})


@app.route('/api/sources/<media_id>/feeds/<feed_id>/single', methods=['GET'])
@flask_login.login_required
@api_error_handler
def feed_details(media_id, feed_id):
    user_mc = user_mediacloud_client()
    feed = user_mc.feed(feed_id)
    return jsonify({'feed': feed })


@app.route('/api/sources/<media_id>/feeds/feeds.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_feed_csv(media_id):
    return stream_feed_csv('feeds-Source-' + media_id, media_id)


@app.route('/api/sources/<media_id>/feeds/create', methods=['POST'])
@flask_login.login_required
@api_error_handler
# name=None, url=None, feed_type='syndicated', feed_status='active'
def feed_create(media_id):
    user_mc = user_mediacloud_client()
    name = request.form['name']
    url = request.form['url']
    feed_type = request.form['feed_type'] if 'feed_type' in request.form else None  # this is optional
    feed_status = request.form['feed_status'] if 'feed_status' in request.form else None  # this is optional

    result = user_mc.feedCreate(media_id, name, url, feed_type, feed_status)
    return jsonify(result)


@app.route('/api/sources/feeds/<feed_id>/update', methods=['POST'])
@flask_login.login_required
@api_error_handler
def feed_update(feed_id):
    user_mc = user_mediacloud_client()
    name = request.form['name']
    url = request.form['url']
    feed_type = request.form['feed_type'] if 'feed_type' in request.form else None  # this is optional
    feed_status = request.form['feed_status'] if 'feed_status' in request.form else None  # this is optional

    result = user_mc.feedUpdate(feeds_id=feed_id, name=name, url=url, feed_type=feed_type, feed_status=feed_status)
    return jsonify(result)


def source_feed_list(media_id):
    all_feeds = []
    more_feeds = True
    max_feed_id = 0
    prev_max_feed_id = 0
    while more_feeds:
        logger.debug("last_feeds_id %d", max_feed_id)
        feed = source_feed_list_page(media_id, max_feed_id)
        # if exactly 100 rows are retrieved, we need a way of not ending up in a forever loop
        if ((max_feed_id == prev_max_feed_id) and (len(feed) == 100)):
            more_feeds = 0
        else:
            max_feed_id = feed[len(feed)-1]['feeds_id']
            more_feeds = (len(feed) == 100) and (len(feed) != 0)
        all_feeds = all_feeds + feed
        prev_max_feed_id = max_feed_id
    return sorted(all_feeds, key=lambda t: t['name'])


def source_feed_list_page(media_id, max_feed_id):
    user_mc = user_mediacloud_client()
    return user_mc.feedList(media_id=media_id, rows=100, last_feeds_id=max_feed_id)


def stream_feed_csv(filename, media_id):
    response = {}
    response = cached_feed(media_id)
    props = ['name', 'feed_type', 'url']
    return csv.stream_response(response, props, filename)


def cached_feed(media_id):
    res = source_feed_list(media_id)
    return res
