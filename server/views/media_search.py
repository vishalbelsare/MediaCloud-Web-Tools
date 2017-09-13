import logging
from multiprocessing import Pool

from server.auth import user_mediacloud_client, user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)

def media_search(search_str, tags_id=None):
    mc = user_mediacloud_client()
    return mc.mediaList(name_like=search_str, tags_id=tags_id)

def _media_search_worker(job):
    user_mc = user_mediacloud_client()
    return user_mc.tagList(tag_sets_id=job['tag_sets_id'], public_only=job['public_only'], name_like=job['search_str'])


def _matching_tags_by_set(search_str, public_only):
    search_jobs = [{'tag_sets_id': tag_sets_id, 'search_str': search_str, 'public_only': public_only}
                   for tag_sets_id in VALID_COLLECTION_TAG_SETS_IDS]
    pool = Pool(processes=MEDIA_SEARCH_POOL_SIZE)
    matching_tags_in_collections = pool.map(_media_search_worker, search_jobs)
    pool.terminate()
    return matching_tags_in_collections
