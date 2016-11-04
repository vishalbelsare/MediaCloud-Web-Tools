import logging
import server.util.csv as csv
from server.cache import cache
from server.auth import user_mediacloud_client
from server.views.sources.geoutil import COUNTRY_GEONAMES_ID_TO_APLHA3, HIGHCHARTS_KEYS

logger = logging.getLogger(__name__)

GEO_SAMPLE_SIZE = 10000

GEO_TAG_SET = 1011

@cache
def cached_geotag_count(user_mc_key, query):
    user_mc = user_mediacloud_client()
    res = user_mc.sentenceFieldCount('*', query, tag_sets_id=GEO_TAG_SET, sample_size=GEO_SAMPLE_SIZE)
    res = [r for r in res if int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    for r in res:
        geonamesId = int(r['tag'].split('_')[1])
        if geonamesId not in COUNTRY_GEONAMES_ID_TO_APLHA3.keys():   # only include countries
            continue
        r['geonamesId'] = geonamesId    # TODO: move this to JS?
        r['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonamesId]
        r['count'] = (float(r['count'])/float(GEO_SAMPLE_SIZE))    # WTF: why is the API returning this as a string and not a number?
        for hq in HIGHCHARTS_KEYS:
            if hq['properties']['iso-a3'] == r['alpha3']:
                r['iso-a2'] = hq['properties']['iso-a2']
                r['value'] = r['count']
    return res

def stream_geo_csv(user_mc_key, filename, item_id, which):
    info = {}
    info = cached_geotag_count(user_mc_key, which+":"+str(item_id))
    props = ['label', 'count']
    logger.info(info)
    return csv.stream_response(info, props, filename)
