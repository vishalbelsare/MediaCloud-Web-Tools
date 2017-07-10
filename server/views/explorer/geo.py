# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
from server import app, db, mc
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.cache import cache
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3, HIGHCHARTS_KEYS
import server.util.tags as tag_utl
from server.views.explorer import concatenate_query_for_solr, parse_query_with_args_and_sample_search, parse_query_with_keywords, load_sample_searches
import datetime
# load the shared settings file

logger = logging.getLogger(__name__)

@app.route('/api/explorer/demo/geo-tags/counts', methods=['GET'])
def api_explorer_demo_geotag_count():
    return geotag_count()


@cache
def cached_geotags(query):
    return mc.sentenceFieldCount('*', query, field='tags_id_stories', tag_sets_id=tag_utl.GEO_TAG_SET, sample_size=tag_utl.GEO_SAMPLE_SIZE)

def geotag_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_query = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_query = parse_query_with_keywords(request.args)
        # TODO what about other params: date etc for demo..

    # TODO coverage here
    # total_stories = mc.storyCount(solr_query)
    # geotagged_stories = mc.storyCount("({}) AND (tags_id_stories:{})".format(solr_query, CLIFF_CLAVIN_2_3_0_TAG_ID))
    # coverage_pct = float(geotagged_stories) / float(total_stories)

    res = cached_geotags(solr_query)
    res = [r for r in res if int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    for r in res:
        geonamesId = int(r['tag'].split('_')[1])
        if geonamesId not in COUNTRY_GEONAMES_ID_TO_APLHA3.keys():   # only include countries
            continue
        r['geonamesId'] = geonamesId    # TODO: move this to JS?
        r['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonamesId]
        r['count'] = (float(r['count'])/float(tag_utl.GEO_SAMPLE_SIZE))    # WTF: why is the API returning this as a string and not a number?
        for hq in HIGHCHARTS_KEYS:
            if hq['properties']['iso-a3'] == r['alpha3']:
                r['iso-a2'] = hq['properties']['iso-a2']
                r['value'] = r['count']

    # results = {'coverage': coverage_pct, 'list': res }
    return jsonify(res)


def stream_geo_csv(mc_key, filename):
    info = {}
    info = geotag_count()
    props = ['label', 'count']
    return csv.stream_response(info, props, filename)


@app.route('/api/explorer/geography/geography.csv')
@flask_login.login_required
@api_error_handler
def explorer_geo_csv():
    return stream_geo_csv(user_mediacloud_key(), 'geography-Explorer')


