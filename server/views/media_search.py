import logging
from multiprocessing import Pool

from server.auth import user_mediacloud_client
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS, TAG_SET_ABYZ_GEO_COLLECTIONS

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)


def media_search(search_str, tags_id=None):
    mc = user_mediacloud_client()
    return mc.mediaList(name_like=search_str, tags_id=tags_id)


def matching_collections_by_set(search_str, public_only, tag_sets_id_list):
    user_mc = user_mediacloud_client()
    return user_mc.tagList(tag_sets_id_list, public_only=public_only, name_like=search_str)
