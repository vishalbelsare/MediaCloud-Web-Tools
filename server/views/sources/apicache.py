import json
import codecs

from server import mc
from server.cache import cache, key_generator
from server.views.sources import FEATURED_COLLECTION_LIST
from server.views.sources.words import word_count
import server.util.tags as tags


def tags_in_tag_set(mc_api_key, tag_sets_id, only_public_tags, use_file_cache=False):
    return tags.tag_set_with_tags(mc_api_key, tag_sets_id, only_public_tags, use_file_cache)


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_tag_set_file(file_path):
    # hold the file in memory to reduce reads
    with codecs.open(file_path, 'r', 'utf-8') as json_data:
        data = json.load(json_data)
        return data


def tag_set_with_private_collections(mc_api_key, tag_sets_id):
    return tags_in_tag_set(mc_api_key, tag_sets_id, False, True)


def tag_set_with_public_collections(mc_api_key, tag_sets_id):
    return tags_in_tag_set(mc_api_key, tag_sets_id, True, True)


def featured_collections():
    return _cached_featured_collection_list()


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_featured_collection_list():
    return [mc.tag(tags_id) for tags_id in FEATURED_COLLECTION_LIST]
