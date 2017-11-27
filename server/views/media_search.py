import logging
from multiprocessing import Pool

from server.auth import user_mediacloud_client
from server.util.tags import VALID_COLLECTION_TAG_SETS_IDS

logger = logging.getLogger(__name__)

MAX_SOURCES = 20
MAX_COLLECTIONS = 20
MEDIA_SEARCH_POOL_SIZE = len(VALID_COLLECTION_TAG_SETS_IDS)


def media_search(search_str, tags_id=None):
    mc = user_mediacloud_client()
    return mc.mediaList(name_like=search_str, tags_id=tags_id)


def _source_search_worker(job):
    mc = user_mediacloud_client()
    return mc.mediaList(name_like=job['search_str'], rows=100)


def _collection_search_worker(job):
    user_mc = user_mediacloud_client()
    return user_mc.tagList(tag_sets_id=job['tag_sets_id'], public_only=job['public_only'], name_like=job['search_str'])


def _matching_collections_by_set(search_str, public_only):
    user_mc = user_mediacloud_client()
    return user_mc.tagList(VALID_COLLECTION_TAG_SETS_IDS, name_like=search_str)

def _matching_sources_by_set(search_str, public_only):
    use_pool = False    # this is causing a system exit :-(
    search_jobs = [{'tag_sets_id': tag_sets_id, 'search_str': search_str}
                   for tag_sets_id in VALID_COLLECTION_TAG_SETS_IDS]  # provide for tags_id?
    if use_pool:
        pool = Pool(processes=MEDIA_SEARCH_POOL_SIZE)
        matching_sources = pool.map(_source_search_worker, search_jobs)
        pool.close()
    else:
        matching_sources = [_source_search_worker(job) for job in search_jobs]
    return matching_sources
