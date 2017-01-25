import logging
from flask import request

from server import mc, TOOL_API_KEY
from server.cache import cache
from server.auth import user_mediacloud_client
from server.util.request import filters_from_args
from server.views.topics import validated_sort

logger = logging.getLogger(__name__)

def topic_media_list(user_mc_key, topics_id, **kwargs):
    '''
    Return sorted media list based on filters.
    '''
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    merged_args = {
        'snapshots_id': snapshots_id,
        'timespans_id': timespans_id,
        'foci_id': foci_id,
        'sort': validated_sort(request.args.get('sort')),
        'limit': request.args.get('limit'),
        'link_id': request.args.get('linkId'),
    }
    merged_args.update(kwargs)    # passed in args override anything pulled form the request.args
    return _cached_topic_media_list(user_mc_key, topics_id, **merged_args)

@cache
def _cached_topic_media_list(user_mc_key, topics_id, **kwargs):
    '''
    Internal helper - don't call this; call topic_media_list instead. This needs user_mc_key in the
    function signature to make sure the caching is keyed correctly.
    '''
    user_mc = user_mediacloud_client()
    return user_mc.topicMediaList(topics_id, **kwargs)

def topic_story_count(user_mc_key, topics_id, **kwargs):
    '''
    Return filterd story count within topic.
    '''
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    merged_args = {
        'snapshots_id': snapshots_id,
        'timespans_id': timespans_id,
        'foci_id': foci_id,
        'q': request.args.get('q')
    }
    merged_args.update(kwargs)    # passed in args override anything pulled form the request.args
    # logger.info("!!!!!"+str(merged_args['timespans_id']))
    return _cached_topic_story_count(user_mc_key, topics_id, **merged_args)

@cache
def _cached_topic_story_count(user_mc_key, topics_id, **kwargs):
    '''
    Internal helper - don't call this; call topic_story_count instead. This needs user_mc_key in the
    function signature to make sure the caching is keyed correctly.
    '''
    local_mc = None
    if user_mc_key == TOOL_API_KEY:
        local_mc = mc
    else:
        local_mc = user_mediacloud_client()
    return local_mc.topicStoryCount(topics_id, **kwargs)

def topic_story_list(user_mc_key, topics_id, **kwargs):
    '''
    Return sorted story list based on filters.
    '''
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    merged_args = {
        'snapshots_id': snapshots_id,
        'timespans_id': timespans_id,
        'foci_id': foci_id,
        'sort': validated_sort(request.args.get('sort')),
        'limit': request.args.get('limit'),
        'link_id': request.args.get('linkId'),
        'q': request.args.get('q')
    }
    merged_args.update(kwargs)    # passed in args override anything pulled form the request.args
    return _cached_topic_story_list(user_mc_key, topics_id, **merged_args)

@cache
def _cached_topic_story_list(user_mc_key, topics_id, **kwargs):
    '''
    Internal helper - don't call this; call topic_story_list instead. This needs user_mc_key in the
    function signature to make sure the caching is keyed correctly.
    '''
    local_mc = None
    if user_mc_key == TOOL_API_KEY:
        local_mc = mc
    else:
        local_mc = user_mediacloud_client()
    return local_mc.topicStoryList(topics_id, **kwargs)

def topic_word_counts(user_mc_key, topics_id, **kwargs):
    '''
    Return sampled word counts based on filters.
    '''
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    merged_args = {
        'snapshots_id': snapshots_id,
        'timespans_id': timespans_id,
        'foci_id': foci_id,
        'q': request.args.get('q')
    }
    merged_args.update(kwargs)    # passed in args override anything pulled form the request.args
    return _cached_topic_word_counts(user_mc_key, topics_id, **merged_args)

@cache
def _cached_topic_word_counts(user_mc_key, topics_id, **kwargs):
    '''
    Internal helper - don't call this; call topic_word_counts instead. This needs user_mc_key in the
    function signature to make sure the caching is keyed correctly.
    '''
    local_mc = None
    if user_mc_key == TOOL_API_KEY:
        local_mc = mc
    else:
        local_mc = user_mediacloud_client()
    return local_mc.topicWordCount(topics_id, **kwargs)

def topic_sentence_counts(user_mc_key, topics_id, **kwargs):
    '''
    Return setence counts over timebased on filters.
    '''
    snapshots_id, timespans_id, foci_id = filters_from_args(request.args)
    merged_args = {
        'snapshots_id': snapshots_id,
        'timespans_id': timespans_id,
        'foci_id': foci_id,
        'q': request.args.get('q')
    }
    merged_args.update(kwargs)    # passed in args override anything pulled form the request.args
    return _cached_topic_sentence_counts(user_mc_key, topics_id, **merged_args)

@cache
def _cached_topic_sentence_counts(user_mc_key, topics_id, **kwargs):
    '''
    Internal helper - don't call this; call topic_sentence_counts instead. This needs user_mc_key in the
    function signature to make sure the caching is keyed correctly.
    '''
    local_mc = None
    if user_mc_key == TOOL_API_KEY:
        local_mc = mc
    else:
        local_mc = user_mediacloud_client()

    # grab the timespan because we need the start and end dates
    timespan = local_mc.topicTimespanList(topics_id,
        snapshots_id=kwargs['snapshots_id'], foci_id=kwargs['foci_id'], timespans_id=kwargs['timespans_id'])[0]
    return local_mc.topicSentenceCount(topics_id,
        split=True, split_start_date=timespan['start_date'][:10], split_end_date=timespan['end_date'][:10],
        **kwargs)

@cache
def topic_focal_sets(user_mc_key, topics_id, snapshots_id):
    '''
    This needs user_mc_key in the function signature to make sure the caching is keyed correctly.
    '''
    user_mc = user_mediacloud_client()
    response = user_mc.topicFocalSetList(topics_id, snapshots_id=snapshots_id)
    return response

@cache
def cached_topic_timespan_list(user_mc_key, topics_id, snapshots_id, foci_id=None):
    # this includes the user_mc_key as a first param so the cache works right
    user_mc = user_mediacloud_client()
    timespans = user_mc.topicTimespanList(topics_id, snapshots_id=snapshots_id, foci_id=foci_id)
    return timespans
