import logging

import server.util.csv as csv
from server.cache import cache
from server.auth import user_mediacloud_client

logger = logging.getLogger(__name__)

@cache
def source_feed_list(media_id):
    all_feeds = []
    last_id = 0
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

@cache
def source_feed_list_page(media_id, max_feed_id):
    user_mc = user_mediacloud_client()
    return user_mc.feedList(media_id=media_id, rows=100, last_feeds_id= max_feed_id)


def stream_feed_csv(filename, media_id):
    response = {}
    response = cached_feed(media_id)
    props = ['name', 'feed_type', 'url']
    return csv.stream_response(response, props, filename)

@cache
def cached_feed(media_id):
    res = source_feed_list(media_id)
    return res
