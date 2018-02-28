from server import mc, TOOL_API_KEY
from server.cache import cache, key_generator
from server.auth import user_mediacloud_client, user_mediacloud_key, is_user_logged_in
from server.util.tags import processed_by_cliff_query_clause


def top_tags_with_coverage(q, tag_sets_id, limit, sample_size):
    tag_counts = most_used_tags(q, tag_sets_id, limit, sample_size)
    coverage = cliff_coverage(q)
    for t in tag_counts:  # add in pct of what's been run through CLIFF to total results
        t['pct'] = float(t['count']) / sample_size
    coverage['results'] = tag_counts
    return coverage


def most_used_tags(q, tag_sets_id, limit, sample_size):
    # top tags used in stories matching query (pass in None for no limit)
    api_key = _api_key()
    sentence_count_results = _cached_most_used_tags(api_key, q, tag_sets_id, sample_size)
    top_count_results = sentence_count_results[:limit] if limit is not None else sentence_count_results
    return top_count_results


def cliff_coverage(q):
    # dict of info about stories tagged by CLIFF
    return tag_set_coverage(q, u'({}) AND {}'.format(q, processed_by_cliff_query_clause()))


def tag_set_coverage(total_q, subset_q):
    api_key = _api_key()
    coverage = {
        'totals': _cached_story_count(api_key, total_q),
        'counts': _cached_story_count(api_key, subset_q),
    }
    coverage['coverage_percentage'] = 0 if coverage['totals'] is 0 else float(coverage['counts'])/float(coverage['totals'])
    return coverage


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_most_used_tags(api_key, query, tag_sets_id, sample_size):
    # top tags used in stories matching query
    # api_key used for caching at the user level
    local_mc = _mc_client()
    return local_mc.sentenceFieldCount('*', query, field='tags_id_stories', tag_sets_id=tag_sets_id,
                                       sample_size=sample_size)


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_story_count(api_key, q):
    # api_key is included to keep the cache at the user-level
    local_mc = _mc_client()
    return local_mc.storyCount(q)['count']


def _api_key():
    api_key = user_mediacloud_key() if is_user_logged_in() else TOOL_API_KEY
    return api_key


def _mc_client():
    # return the user's client handler, or a tool one if not logged in
    if is_user_logged_in():
        client_to_use = user_mediacloud_client()
    else:
        client_to_use = mc
    return client_to_use
