from server.auth import user_admin_mediacloud_client
from server.cache import cache, key_generator

SOURCES_TEMPLATE_PROPS_EDIT = ['media_id', 'url', 'name', 'pub_country', 'pub_state', 'primary_language',
                               'subject_country', 'media_type', 'public_notes', 'is_monitored', 'editor_notes']

COLLECTIONS_TEMPLATE_PROPS_EDIT = ['media_id', 'url', 'name', 'pub_country', 'pub_state', 'primary_language',
                                   'subject_country', 'media_type', 'public_notes', 'is_monitored', 'editor_notes']

COLLECTIONS_TEMPLATE_METADATA_PROPS = ['pub_country', 'pub_state', 'subject_country', 'primary_language', 'media_type']

# hand-made whitelist of collections to show up as "featured" on source mgr homepage and in the media picker
FEATURED_COLLECTION_LIST = [
    58722749,  # US top 50 PEW 2017
    57078150,  # US digital native 2016 PEW
    34412118,  # India national
    34412232,  # Russia national
    38379799,  # France - State & Local
    9272347,   # ABYZ Global English
    34412476,  # UK National
    34412202,  # Ghana National
    38381372,  # US Massachusetts State/Local
    9360520,   # US Partisan sets
    9360521,
    9360522,
    9360523,
    9360524
]


@cache.cache_on_arguments(function_key_generator=key_generator)
def cached_source_story_count(user_mc_key, query):
    user_mc = user_admin_mediacloud_client()
    return user_mc.storyCount(query)['count']
