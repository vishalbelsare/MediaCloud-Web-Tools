# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
import json

from server import app, mc
import server.util.csv as csv
from server.auth import is_user_logged_in, user_mediacloud_key, user_mediacloud_client
from server.cache import cache, key_generator
from server.util.request import api_error_handler
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3, HIGHCHARTS_KEYS
import server.util.tags as tag_utl
from server.views.explorer import parse_as_sample, parse_query_with_args_and_sample_search, parse_query_with_keywords, \
    load_sample_searches, file_name_for_download

logger = logging.getLogger(__name__)


@app.route('/api/explorer/geo-tags/counts', methods=['GET'])
@flask_login.login_required
def api_explorer_geotag_count():
    return geotag_count()


@app.route('/api/explorer/demo/geo-tags/counts', methods=['GET'])
def api_explorer_demo_geotag_count():
    return geotag_count()


@app.route('/api/explorer/geography/geography.csv', methods=['POST'])
@api_error_handler
def explorer_geo_csv():
    filename = u'sampled-geographic-coverage'
    data = request.form
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
    res = _query_geotags(solr_q, solr_fq)
    res = [r for r in res if int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    for r in res:
        geonamesId = int(r['tag'].split('_')[1])
        if geonamesId not in COUNTRY_GEONAMES_ID_TO_APLHA3.keys():   # only include countries
            continue
        r['geonamesId'] = geonamesId
        r['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonamesId]
        r['count'] = (float(r['count'])/float(tag_utl.GEO_SAMPLE_SIZE))    # WTF: why is the API returning this as a string and not a number?
        for hq in HIGHCHARTS_KEYS:
            if hq['properties']['iso-a3'] == r['alpha3']:
                r['iso-a2'] = hq['properties']['iso-a2']
                r['value'] = r['count']
    props = ['label', 'count', 'alpha3', 'iso-a2', 'geonamesId', 'tags_id', 'tag']
    return csv.stream_response(res, props, filename)


def geotag_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_q, solr_fq= parse_query_with_keywords(request.args)

    # TODO coverage here
    # total_stories = mc.storyCount(solr_query)
    # geotagged_stories = mc.storyCount("({}) AND (tags_id_stories:{})".format(solr_query, CLIFF_CLAVIN_2_3_0_TAG_ID))
    # coverage_pct = float(geotagged_stories) / float(total_stories)

    res = _query_geotags(solr_q, solr_fq)
    res = [r for r in res if int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    for r in res:
        geonames_id = int(r['tag'].split('_')[1])
        if geonames_id not in COUNTRY_GEONAMES_ID_TO_APLHA3.keys():   # only include countries
            continue
        r['geonamesId'] = geonames_id    # TODO: move this to JS?
        r['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonames_id]
        r['count'] = (float(r['count'])/float(tag_utl.GEO_SAMPLE_SIZE))    # WTF: why is the API returning this as a string and not a number?
        for hq in HIGHCHARTS_KEYS:
            if hq['properties']['iso-a3'] == r['alpha3']:
                r['iso-a2'] = hq['properties']['iso-a2']
                r['value'] = r['count']

    # results = {'coverage': coverage_pct, 'list': res }
    return jsonify(res)


def _query_geotags(q, fq):
    if is_user_logged_in():   # no user session
        user_mc_key = user_mediacloud_key()
    else:
        user_mc_key = None
    return _cached_geotags(user_mc_key, q, fq)


@cache.cache_on_arguments(function_key_generator=key_generator)
def _cached_geotags(user_mc_key, q, fq):
    if is_user_logged_in():   # no user session
        api_client = user_mediacloud_client()
    else:
        api_client = mc
    return api_client.sentenceFieldCount(q, fq, field='tags_id_stories', tag_sets_id=tag_utl.GEO_TAG_SET, sample_size=tag_utl.GEO_SAMPLE_SIZE)
