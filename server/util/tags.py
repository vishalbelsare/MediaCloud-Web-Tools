import re
import logging

from server import mc
from server.auth import user_mediacloud_client
from server.cache import cache

logger = logging.getLogger(__name__)

STORY_UNDATEABLE_TAG = 8877812  # if a story has this tag, that means it was undateable

# constants related to NYT labels (ie. tags on stories indicating what they are about)
NYT_LABELER_1_0_0_TAG_ID = 9360669  # the tag that indicates a story was tagged by the NYT labeller version 1
NYT_LABELS_TAG_SET_ID = 1963  # the tag set all the descriptor tags are in
NYT_LABELS_SAMPLE_SIZE = 10000  # the sample size to use for looking at NYT descriptor tags

# constants for versioning of geo-tagged stories
TAG_SET_GEOCODER_VERSION = 1937
TAG_SET_NYT_LABELS_VERSION = 1964

# constants related to the CLIFF-based geotagging (ie. tags on stories indicating places they are about)
CLIFF_CLAVIN_2_3_0_TAG_ID = 9353691  # the tag that indicates a story was tagged by the CLIFF version 2.3.0
GEO_TAG_SET = 1011  # the tag set all the geo tags are in
GEO_SAMPLE_SIZE = 10000  # the sample size to use for looking at geo tags

# Source collection tags sets
COLLECTIONS_TAG_SET_ID = 5  # holds all the Media Cloud collections
GV_TAG_SET_ID = 556  # holds country collections made from scraping GlobalVoices outlinks
EMM_TAG_SET_ID = 597  # holds country collections made from scraping European Media Monitor source list

# Source metadata tag sets
TAG_SETS_ID_PUBLICATION_COUNTRY = 1935  # holds the country of publication of a source
TAG_SETS_ID_PUBLICATION_STATE = 1962  # holds the state of publication of a source (only US and India right now)
TAG_SETS_ID_PRIMARY_LANGUAGE = 1969  # holds the primary language of a source
TAG_SETS_ID_COUNTRY_OF_FOCUS = 1970  # holds the primary focus on what country for a source

TAG_SETS_ID_RETWEET_PARTISANSHIP_2016 = 1959

METADATA_PUB_COUNTRY_NAME = 'pub_country'
METADATA_PUB_STATE_NAME = 'pub_state'
METADATA_PRIMARY_LANGUAGE_NAME = 'primary_language'
METADATA_PRIMARY_COUNTRY_OF_FOCUS_NAME = 'subject_country'

# map from metadata category name, to metadata tag set id
VALID_METADATA_IDS = [
    {METADATA_PUB_COUNTRY_NAME: TAG_SETS_ID_PUBLICATION_COUNTRY},
    {METADATA_PUB_STATE_NAME: TAG_SETS_ID_PUBLICATION_STATE},
    {METADATA_PRIMARY_LANGUAGE_NAME: TAG_SETS_ID_PRIMARY_LANGUAGE},
    {METADATA_PRIMARY_COUNTRY_OF_FOCUS_NAME: TAG_SETS_ID_COUNTRY_OF_FOCUS}
]


def is_metadata_tag_set(tag_sets_id):
    '''
    Find out if a tag set is one used to hold metadata on a Source.
    :param tag_sets_id: the id of tag set 
    :return: True if it is a valid metadata tag set, False if it is not
    '''
    for name_to_tags_sets_id in VALID_METADATA_IDS:
        if int(tag_sets_id) in name_to_tags_sets_id.values():
            return True
    return False


def format_name_from_label(user_label):
    formatted_name = re.sub('\W|^(?=\d)', '_', user_label)
    return formatted_name


def format_metadata_fields(media_dict, field, value):
    if field == TAG_SETS_ID_PUBLICATION_COUNTRY:
        media_dict['pub_country'] = value[-3:]
    elif field == TAG_SETS_ID_PUBLICATION_STATE:
        media_dict['pub_state'] = value
    elif field == TAG_SETS_ID_PRIMARY_LANGUAGE:
        media_dict['primary_language'] = value
    elif field == TAG_SETS_ID_COUNTRY_OF_FOCUS:
        media_dict['subject_country'] = value


@cache
def cached_tags_in_tag_set(tag_sets_id):
    '''
    This is cached at the app level, so it doesn't need a user key.  This is because
    the list of tags here shouldn't change (ie. metadata values don't change within a category)
    '''
    all_tags = []
    last_id = 0
    more = True
    while more:
        current_list = mc.tagList(tag_sets_id=tag_sets_id, rows=100, last_tags_id=last_id)
        last_id = current_list[-1]['tags_id']
        more = (len(current_list) == 100) and (len(current_list) != 0)
        all_tags = all_tags + current_list
    all_tags = sorted(all_tags, key=lambda tag: tag['label'])
    return all_tags


def media_with_tag(user_mc_key, tags_id, cached=False):
    more_media = True
    all_media = []
    max_media_id = 0
    while more_media:
        logger.debug("last_media_id %s", str(max_media_id))
        if cached:
            media = _cached_media_with_tag_page(tags_id, max_media_id)
        else:
            media = _media_with_tag_page(tags_id, max_media_id)
        all_media = all_media + media
        if len(media) > 0:
            max_media_id = media[len(media) - 1]['media_id']
        more_media = len(media) != 0
    return sorted(all_media, key=lambda t: t['name'].lower())


@cache
def _cached_media_with_tag_page(tags_id, max_media_id):
    '''
    We have to do this on the page, not the full list because memcache has a 1MB cache upper limit,
    and some of the collections have TONS of sources
    '''
    user_mc = user_mediacloud_client()
    return user_mc.mediaList(tags_id=tags_id, last_media_id=max_media_id, rows=100)


def _media_with_tag_page(tags_id, max_media_id):
    user_mc = user_mediacloud_client()
    return user_mc.mediaList(tags_id=tags_id, last_media_id=max_media_id, rows=100)
