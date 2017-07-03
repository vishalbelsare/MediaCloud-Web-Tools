import logging
from flask import request
from server.auth import user_admin_mediacloud_client
from server import mc

logger = logging.getLogger(__name__)


def _tag_ids_from_collections_param(input):
    tag_ids_to_add = []
    if len(input) > 0:
        tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",") if len(cid) > 0]
    return set(tag_ids_to_add)

def _media_ids_from_sources_param(input):
    media_ids_to_add = []
    if len(input) > 0:
        media_ids_to_add = [int(cid) for cid in request.form['sources[]'].split(",") if len(cid) > 0]
    return media_ids_to_add

def _media_tag_ids_from_collections_param(input):
    media_tag_ids_to_add = []
    if len(input) > 0:
        media_tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",") if len(cid) > 0]
    return media_tag_ids_to_add


def collection_media_list(user_mc_key, tags_id):
    more_media = True
    all_media = []
    max_media_id = 0
    while more_media:
        logger.debug("last_media_id %s", str(max_media_id))
        media = collection_media_list_page(tags_id, max_media_id)
        all_media = all_media + media
        if len(media) > 0:
            max_media_id = media[len(media) - 1]['media_id']
        more_media = len(media) != 0
    return sorted(all_media, key=lambda t: t['name'].lower())


def collection_media_list_page(tags_id, max_media_id):
    '''
    We have to do this on the page, not the full list because memcache has a 1MB cache upper limit,
    and some of the collections have TONS of sources
    '''
    return mc.mediaList(tags_id=tags_id, last_media_id=max_media_id, rows=100)