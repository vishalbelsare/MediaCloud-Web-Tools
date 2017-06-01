import json
import logging
import flask_login
import os
from server import app, base_dir, mc
from flask import jsonify
from server.auth import is_user_logged_in, user_admin_mediacloud_client
import datetime

logger = logging.getLogger(__name__)

SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'

# TODO maybe move all of this up
def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort


def topic_is_public(topics_id):
    topic = mc.topic(topics_id)
    is_public = topic['is_public']
    return int(is_public)== 1


def access_public_topic(topics_id):
    # check whether logged in here since it is a requirement for public access
    if (not is_user_logged_in()) and (topic_is_public(topics_id)):
        return True
    return False

def solr_query_from_request(request):
    solr_seed_query=request['q'],
    start_date= request['start_date'],
    end_date=request['end_date'],
    media_ids=_media_ids_from_sources_param(request['sources[]']) if 'sources[]' in request else None,
    tags_ids=_media_tag
    return concatenate_query_for_solr(solr_seed_query, start_date, end_date, media_ids, tags_ids)

# helper for topic preview queries -- TODO move up
def concatenate_query_for_solr(solr_seed_query, start_date, end_date, media_ids, tags_ids):
    query = '({})'.format(solr_seed_query)

    if len(media_ids) > 0 or len(tags_ids) > 0:
        query += " AND ("
        # add in the media sources they specified
        if len(media_ids) > 0:
            query_media_ids = " ".join(map(str, media_ids))
            query_media_ids = " media_id:({})".format(query_media_ids)
            query += '('+query_media_ids+')'

        if len(media_ids) > 0 and len(tags_ids) > 0:
            query += " OR "
        # add in the collections they specified
        if len(tags_ids) > 0:
            query_tags_ids = " ".join(map(str, tags_ids))
            query_tags_ids = " tags_id_media:({})".format(query_tags_ids)
            query += '('+query_tags_ids+')'
        query += ')'

    if start_date:
        query += " AND (+" + concatenate_query_and_dates(start_date, end_date) + ")"
    
    return query


def concatenate_query_and_dates(start_date, end_date):
    user_mc = user_admin_mediacloud_client()
    publish_date = user_mc.publish_date_query(datetime.datetime.strptime(start_date, '%Y-%m-%d').date(),
                                              datetime.datetime.strptime(end_date, '%Y-%m-%d').date())

    return publish_date
