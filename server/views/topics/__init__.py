import json
import logging
import flask_login
import os
from server import app, base_dir, mc
from flask import jsonify
from server.auth import is_user_logged_in, user_mediacloud_client
import datetime

logger = logging.getLogger(__name__)

SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'

try:
    topics_data = json.load(open(os.path.join(base_dir, 'server', 'static', 'data', 'all_topics.json')))
    CACHED_TOPICS = topics_data['topics']
    IS_CACHED = True
except IOError as e:
    logger.warning("Run update_topic_list.py to generate the cached topic list!")
    CACHED_TOPICS = []
    IS_CACHED = False

def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort

def topic_is_public(topics_id):
    topic = mc.topic(topics_id)
    is_public = topic['is_public']
    # return bool(is_public)
    return True

def access_public_topic(topics_id):
    # check whether logged in here since it is a requirement for public access
    if ((not is_user_logged_in()) and (topic_is_public(topics_id))):
        return True
    return False


# TODO is this the best place or in util? this is topic specific....
def concatenate_query_for_solr(args):
    query = '({})'.format(args['solr_seed_query'])

    if len(args['media_id']) > 0 or len(args['tags_id']) > 0:
        query += " AND ("
        # add in the media sources they specified
        if len(args['media_id']) > 0:
            query_media_id = " ".join(map(str, args['media_id']))
            query_media_id = " media_id:({})".format(query_media_id)
            query += '('+query_media_id+')'

        if len(args['media_id']) > 0 and len(args['tags_id']) > 0:
            query += " OR "
        # add in the collections they specified
        if len(args['tags_id']) > 0:
            query_tags_id = " ".join(map(str, args['tags_id']))
            query_tags_id = " tags_id_media:({})".format(query_tags_id)
            query += '('+query_tags_id+')'
        query += ')'

    if 'start_date' in args:
        query += " AND (+" + concatenate_query_and_dates(args['start_date'], args['end_date']) + ")"
    
    return query


def concatenate_query_and_dates(start_date, end_date):
    user_mc = user_mediacloud_client()
    publish_date = user_mc.publish_date_query(datetime.datetime.strptime(start_date, '%Y-%m-%d').date(),
                                              datetime.datetime.strptime(end_date, '%Y-%m-%d').date())

    return publish_date
