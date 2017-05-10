from server.util.csv import stream_response
from server.auth import user_has_auth_role, ROLE_MEDIA_EDIT

SOURCES_TEMPLATE_PROPS_VIEW = ['media_id', 'url','name', 'pub_country', 'pub_state', 'primary_language', 'public_notes', 'is_monitored']
SOURCES_TEMPLATE_PROPS_EDIT = ['media_id', 'url','name', 'pub_country', 'pub_state', 'primary_language', 'public_notes', 'is_monitored', 'editor_notes']

COLLECTIONS_TEMPLATE_PROPS_EDIT = ['media_id', 'url','name', 'pub_country', 'pub_state', 'primary_language', 'public_notes', 'is_monitored', 'editor_notes']

# hand-made whitelist of collections to show up as "featured" on source mgr homepage
FEATURED_COLLECTION_LIST = [8875027, 2453107, 8878332, 9201395]

# hand-made whitelist of collections to show up as "popular" on source mgr homepage
POPULAR_COLLECTION_LIST = [9272347, 9201395, 8877968, 9315147, 9353688, 9173065, 9325106, 8875027, 8878332, 9319462, 9353689, 9353685, 9139458, 9273433, 9297151, 9351677, 9213928, 9228386, 9349925]

def download_sources_csv(all_media, file_prefix):

    # info = user_mc.tag(int(collection_id))
    for src in all_media:

        # handle nulls
        if 'pub_country' not in src:
            src['pub_country'] = ''
        if 'editor_notes' not in src:
            src['editor_notes'] = ''
        if 'is_monitored' not in src:
            src['is_monitored'] = ''
        if 'public_notes' not in src:
            src['public_notes'] = ''
        if 'pub_state' not in src:
            src['pub_state'] = ''
        if 'primary_language' not in src:
            src['primary_language'] = ''

    what_type_download = SOURCES_TEMPLATE_PROPS_EDIT

    if user_has_auth_role(ROLE_MEDIA_EDIT):
        what_type_download = SOURCES_TEMPLATE_PROPS_EDIT
    else:
        what_type_download = SOURCES_TEMPLATE_PROPS_VIEW # no editor_notes

    return stream_response(all_media, what_type_download, file_prefix, what_type_download)