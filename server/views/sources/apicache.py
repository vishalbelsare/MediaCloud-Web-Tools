from operator import itemgetter
import os
import json
from mediacloud import MediaCloud
import codecs

from server import mc, base_dir
from server.cache import cache, key_generator
from server.views.sources import FEATURED_COLLECTION_LIST, POPULAR_COLLECTION_LIST
from server.views.sources.words import cached_wordcount

static_tag_set_cache_dir = os.path.join(base_dir, 'server', 'static', 'data')


def tags_in_tag_set(mc_api_key, tag_sets_id, only_public_tags, use_file_cache=False):
    local_mc = MediaCloud(mc_api_key)
    if use_file_cache:
        file_name = "tags_in_{}.json".format(tag_sets_id)
        file_path = os.path.join(static_tag_set_cache_dir, file_name)
        if os.path.isfile(file_path):
            return cached_tag_set_file(file_path)   # more caching!
    tag_set = local_mc.tagSet(tag_sets_id)
    # page through tags
    more_tags = True
    all_tags = []
    last_tags_id = 0
    while more_tags:
        tags = _cached_tag_list(mc_api_key, tag_set['tag_sets_id'], last_tags_id, 100, only_public_tags)
        all_tags = all_tags + tags
        if len(tags) > 0:
            last_tags_id = tags[-1]['tags_id']
        more_tags = len(tags) != 0
    tag_list = [t for t in all_tags if (only_public_tags is False) or
                (t['show_on_media'] is 1 or t['show_on_media'] is True)]  # double check the show_on_media because that controls public or not
    tag_list = sorted(tag_list, key=itemgetter('label'))
    tag_set['tags'] = tag_list
    tag_set['name'] = tag_set['label']  # for backwards compatability
    return tag_set


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


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_tag_list(mc_api_key, tag_sets_id, last_tags_id, rows, public_only):
    local_mc = MediaCloud(mc_api_key)
    # user agnostic cache here, because it isn't user-dependent
    tag_list = local_mc.tagList(tag_sets_id=tag_sets_id, last_tags_id=last_tags_id, rows=rows, public_only=public_only)
    return tag_list


def featured_collections():
    return cached_featured_collections


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_featured_collections():
    collections = []
    for tags_id in FEATURED_COLLECTION_LIST:
        info = mc.tag(tags_id)
        info['id'] = tags_id
        # use None here to use app-level mc object
        info['wordcount'] = cached_wordcount(None, 'tags_id_media:' + str(tags_id))
        collections += [info]
    return collections


def popular_collections():
    return cached_popular_collections()


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_popular_collections():
    collections = []
    for tags_id in POPULAR_COLLECTION_LIST:
        info = mc.tag(tags_id)
        info['id'] = tags_id
        collections += [info]
    return collections