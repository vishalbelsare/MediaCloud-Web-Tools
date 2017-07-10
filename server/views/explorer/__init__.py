import json
import logging
import flask_login
import os
import json
from server import app, base_dir, mc
from server.util.common import _tag_ids_from_collections_param, _media_ids_from_sources_param
from flask import jsonify, send_from_directory
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
    solr_seed_query=request['q']
    start_date= request['start_date']
    end_date=request['end_date']

    # TODO it is an error if no sources or collections
    media_ids=_media_ids_from_sources_param(request['sources[]']) if 'sources[]' in request else []
    tags_ids=_tag_ids_from_collections_param(request['collections[]']) if 'collections[]' in request else []
    return concatenate_query_for_solr(solr_seed_query, start_date, end_date, media_ids, tags_ids)

# helper for topic preview queries -- TODO move up
def concatenate_query_for_solr(solr_seed_query, start_date, end_date, media_ids, tags_ids):
    query = u'({})'.format(solr_seed_query)

    if len(media_ids) > 0 or len(tags_ids) > 0:
        query += " AND ("
        # add in the media sources they specified
        if len(media_ids) > 0:
            query_media_ids = u" ".join(map(str, media_ids))
            query_media_ids = u" media_id:({})".format(query_media_ids)
            query += '('+query_media_ids+')'

        if len(media_ids) > 0 and len(tags_ids) > 0:
            query += " OR "
        # add in the collections they specified
        if len(tags_ids) > 0:
            query_tags_ids = u" ".join(map(str, tags_ids))
            query_tags_ids = u" tags_id_media:({})".format(query_tags_ids)
            query += u'('+query_tags_ids+')'
        query += ')'

    if start_date:
        start_date = u'{}'.format(start_date)
        end_date = u'{}'.format(end_date)
        query += " AND (+" + concatenate_query_and_dates(start_date, end_date) + ")"
    
    return query

# TODO defaults cause an error
def concatenate_query_and_dates(start_date, end_date):
    user_mc = user_admin_mediacloud_client()

    testa = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
    testb = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
    publish_date = user_mc.publish_date_query(testa,
                                              testb,
                                              True, True)

    return publish_date

def parse_query_with_keywords(args) :

    solr_query = ''

    # default dates
    two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
    start_date = two_weeks_before_now.strftime("%Y-%m-%d")
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    current_query = ''
    # TODO should we allow this from the client?
    # should I break this out into just a demo routine where we add in the start/end date without relying that the try statement will fail?

    try:    # if user arguments are present and allowed by the client endpoint, use them, otherwise use defaults
        current_query = args['q']
        start_date = args['start_date'] if 'start_date' in args else start_date
        end_date = args['end_date'] if 'end_date' in args else end_date
        media_ids = args['sources[]'] if 'sources[]' in args else []
        tags_ids = args['collections[]'] if 'collections[]' in args else [8875027]

        solr_query = concatenate_query_for_solr(solr_seed_query=current_query,
            start_date= start_date,
            end_date=end_date,
            media_ids=media_ids,
            tags_ids=tags_ids)


    # otherwise, default
    except Exception as e:
        logger.warn("user custom query failed, there's a problem with the arguments " + str(e))

    return solr_query

def parse_query_with_args_and_sample_search(args_or_query, current_search) :

    solr_query = ''

    # default dates
    two_weeks_before_now = datetime.datetime.now() - datetime.timedelta(days=14)
    start_date = two_weeks_before_now.strftime("%Y-%m-%d")
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    current_query = ''
    try:
        index = int(args_or_query['index']) or int(args_or_query)
        query_id = int(args_or_query['query_id']) # not using this now, but we could use this as an extra check
        current_query = current_search[index]['q']
        start_date = current_search[index]['startDate']
        end_date = current_search[index]['endDate']
        media_ids = current_search[index]['sources']
        tags_ids = current_search[index]['collections']

        solr_query = concatenate_query_for_solr(solr_seed_query=current_query,
            start_date= start_date,
            end_date=end_date,
            media_ids=media_ids,
            tags_ids=tags_ids)


    # we dont have a query_id. Do we have a q param?
    except Exception as e:
        logger.warn("Demo user is querying for a keyword: " + str(e))
        try:
            current_query = int(args_or_query)
        except Exception as e:
            current_query = args_or_query['q'] if 'q' in args_or_query else None
            
        solr_query = concatenate_query_for_solr(solr_seed_query=current_query,
            start_date= start_date,
            end_date=end_date,
            media_ids=[],
            tags_ids=[8875027])

    return solr_query

def load_sample_searches():
    json_file = os.path.join(os.path.dirname( __file__ ), '../..', 'static/data/sample_searches.json')
    # load the sample searches file
    with open(json_file) as json_data:
        d = json.load(json_data)
        return d

def read_sample_searches():
    json_dir = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..', 'static/data'))

    # load the sample searches file
    return send_from_directory(
            json_dir,
            'sample_searches.json', as_attachment=True)

