import datetime, json, logging, traceback, sys
from random import randint

import logging
from operator import itemgetter
from flask import Flask, render_template, jsonify, request, abort
import flask_login

from server import app, mc

logger = logging.getLogger(__name__)


@app.route('/api/sources/source/list', methods=['GET'])
#@flask_login.login_required
def api_media_source_list ():
    source_list = _get_media_source_list()
    return jsonify({'results':source_list})

#@cache
#Helper
def _get_media_source_list():
    source_list = mc.mediaList(last_media_id=0,rows=100)
    #source_list = sorted(source_list, key=lambda ts: ts['label'])
    return source_list


@app.route('/api/sources/collection/list', methods=['GET'])
#@flask_login.login_required
def api_get_media_tag_list():
    tag_list = mc.tagList()
    #tag_list = sorted(tag_list, key=lambda ts: ts['label'])
    return jsonify({'results':tag_list})


#@app.route('/api/sources/media-tag-set/list', methods=['GET'])
#@flask_login.login_required
#def api_media_tag_set_list ():
#    media_tag_sets = [5, 556, 597, 1099]
#    tag_sets = _get_media_tag_set_list(media_tag_sets)
#    return jsonify({'results':tag_sets})

#@cache
#Helper
#def _get_media_tag_set_list(media_tag_sets):
#    tag_sets = [ mc.tagSet(tag_sets_id) for tag_sets_id in media_tag_sets ]
 #   tag_sets = sorted(tag_sets, key=lambda ts: ts['label'])
 #   return tag_sets

@app.route('/api/sources/media-tag/<media_tag_id>/details', methods=['GET'])
#@flask_login.login_required
def api_media_tag_details(media_tag_id):
    info = _get_media_tag_details(media_tag_id)
    return jsonify({'results':info})


 #@cache 
 #Helper  
def _get_media_tag_details(media_tag_id):
    info = mc.tag(media_tag_id)
    info['id'] = media_tag_id
    info['tag_set'] = mc.tagSet(info['tag_sets_id'])
    # page through media if there are more than 100
    more_media = True
    all_media = []
    max_media_id = 0
    while(more_media):
        logging.warn("last_media_id %d" % max_media_id)
        media = mc.mediaList(tags_id=media_tag_id,last_media_id=max_media_id,rows=100)
        all_media = all_media + media
        if len(media)>0:
            max_media_id = media[-1]['media_id']
        more_media = len(media)!=0
    info['media'] = [ {'id':m['media_id'],'name':m['name']} for m in sorted(all_media, key=lambda t: t['name']) ]
    return info

@app.route('/api/sources/media-source/<media_id>/details')
#@flask_login.login_required
def api_media_source_details(media_id):
    health = _get_media_source_health(media_id)
    info = {}
    info = _get_media_source_details(media_id, health['start_date'][:10])
    info['health'] = health
    return jsonify({'results':info})

@app.route('/api/sources/media-tag/<media_tag_id>/sentences/count', methods=['GET'])
#@flask_login.login_required
def api_media_tag_sentence_count(media_tag_id):
    info = {}
    info['sentenceCounts'] = _recent_sentence_counts( ['tags_id_media:'+str(media_tag_id)] )
    return jsonify({'results':info})


@app.route('/api/sources/media-source/<media_id>/sentences/count')
#@flask_login.login_required
def api_media_source_sentence_count(media_id):
    health = _get_media_source_health(media_id)
    info = {}
    info['health'] = health
    info['sentenceCounts'] = _recent_sentence_counts( ['media_id:'+str(media_id)], health['start_date'][:10] )
    return jsonify({'results':info})

#@cache
#Helper
def _get_media_source_health(media_id):
    return mc.mediaHealth(media_id)
    ###??

#@cache
#Helper
def _get_media_source_details(media_id, start_date_str = None):
    info = mc.media(media_id)
    info['id'] = media_id
    info['sentenceCounts'] = _recent_sentence_counts( ['media_id:'+str(media_id)], start_date_str )
    info['feedCount'] = len(mc.feedList(media_id=media_id,rows=100))
    return info

#@cache
#Helper
def _recent_sentence_counts(fq, start_date_str=None):
    '''
    Helper to fetch sentences counts over the last year for an arbitrary query
    '''
    if start_date_str is None:
        last_n_days = 365
        start_date = datetime.date.today()-datetime.timedelta(last_n_days)
    else:
        start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d')    # throws value error if incorrectly formatted
    yesterday = datetime.date.today()-datetime.timedelta(1)
    fq.append( mc.publish_date_query(start_date,yesterday) )
    sentences_over_time = mc.sentenceCount('*', solr_filter=fq, split=True,
        split_start_date=datetime.datetime.strftime(start_date,'%Y-%m-%d'),
        split_end_date=datetime.datetime.strftime(yesterday,'%Y-%m-%d'))['split']
    del sentences_over_time['end']
    del sentences_over_time['gap']
    del sentences_over_time['start']

    return [{'timespanStart':d,'sentenceCount':s} for (d, s) in sentences_over_time.iteritems()]
##??

# generated via regex from 
COUNTRY_GEONAMES_ID_TO_APLHA3 = {3041565:"AND",290557:"ARE",1149361:"AFG",3576396:"ATG",3573511:"AIA",783754:"ALB",174982:"ARM",3351879:"AGO",6697173:"ATA",3865483:"ARG",5880801:"ASM",2782113:"AUT",2077456:"AUS",3577279:"ABW",661882:"ALA",587116:"AZE",3277605:"BIH",3374084:"BRB",1210997:"BGD",2802361:"BEL",2361809:"BFA",732800:"BGR",290291:"BHR",433561:"BDI",2395170:"BEN",3578476:"BLM",3573345:"BMU",1820814:"BRN",3923057:"BOL",7626844:"BES",3469034:"BRA",3572887:"BHS",1252634:"BTN",3371123:"BVT",933860:"BWA",630336:"BLR",3582678:"BLZ",6251999:"CAN",1547376:"CCK",203312:"COD",239880:"CAF",2260494:"COG",2658434:"CHE",2287781:"CIV",1899402:"COK",3895114:"CHL",2233387:"CMR",1814991:"CHN",3686110:"COL",3624060:"CRI",3562981:"CUB",3374766:"CPV",7626836:"CUW",2078138:"CXR",146669:"CYP",3077311:"CZE",2921044:"DEU",223816:"DJI",2623032:"DNK",3575830:"DMA",3508796:"DOM",2589581:"DZA",3658394:"ECU",453733:"EST",357994:"EGY",2461445:"ESH",338010:"ERI",2510769:"ESP",337996:"ETH",660013:"FIN",2205218:"FJI",3474414:"FLK",2081918:"FSM",2622320:"FRO",3017382:"FRA",2400553:"GAB",2635167:"GBR",3580239:"GRD",614540:"GEO",3381670:"GUF",3042362:"GGY",2300660:"GHA",2411586:"GIB",3425505:"GRL",2413451:"GMB",2420477:"GIN",3579143:"GLP",2309096:"GNQ",390903:"GRC",3474415:"SGS",3595528:"GTM",4043988:"GUM",2372248:"GNB",3378535:"GUY",1819730:"HKG",1547314:"HMD",3608932:"HND",3202326:"HRV",3723988:"HTI",719819:"HUN",1643084:"IDN",2963597:"IRL",294640:"ISR",3042225:"IMN",1269750:"IND",1282588:"IOT",99237:"IRQ",130758:"IRN",2629691:"ISL",3175395:"ITA",3042142:"JEY",3489940:"JAM",248816:"JOR",1861060:"JPN",192950:"KEN",1527747:"KGZ",1831722:"KHM",4030945:"KIR",921929:"COM",3575174:"KNA",1873107:"PRK",1835841:"KOR",831053:"XKX",285570:"KWT",3580718:"CYM",1522867:"KAZ",1655842:"LAO",272103:"LBN",3576468:"LCA",3042058:"LIE",1227603:"LKA",2275384:"LBR",932692:"LSO",597427:"LTU",2960313:"LUX",458258:"LVA",2215636:"LBY",2542007:"MAR",2993457:"MCO",617790:"MDA",3194884:"MNE",3578421:"MAF",1062947:"MDG",2080185:"MHL",718075:"MKD",2453866:"MLI",1327865:"MMR",2029969:"MNG",1821275:"MAC",4041468:"MNP",3570311:"MTQ",2378080:"MRT",3578097:"MSR",2562770:"MLT",934292:"MUS",1282028:"MDV",927384:"MWI",3996063:"MEX",1733045:"MYS",1036973:"MOZ",3355338:"NAM",2139685:"NCL",2440476:"NER",2155115:"NFK",2328926:"NGA",3617476:"NIC",2750405:"NLD",3144096:"NOR",1282988:"NPL",2110425:"NRU",4036232:"NIU",2186224:"NZL",286963:"OMN",3703430:"PAN",3932488:"PER",4030656:"PYF",2088628:"PNG",1694008:"PHL",1168579:"PAK",798544:"POL",3424932:"SPM",4030699:"PCN",4566966:"PRI",6254930:"PSE",2264397:"PRT",1559582:"PLW",3437598:"PRY",289688:"QAT",935317:"REU",798549:"ROU",6290252:"SRB",2017370:"RUS",49518:"RWA",102358:"SAU",2103350:"SLB",241170:"SYC",366755:"SDN",7909807:"SSD",2661886:"SWE",1880251:"SGP",3370751:"SHN",3190538:"SVN",607072:"SJM",3057568:"SVK",2403846:"SLE",3168068:"SMR",2245662:"SEN",51537:"SOM",3382998:"SUR",2410758:"STP",3585968:"SLV",7609695:"SXM",163843:"SYR",934841:"SWZ",3576916:"TCA",2434508:"TCD",1546748:"ATF",2363686:"TGO",1605651:"THA",1220409:"TJK",4031074:"TKL",1966436:"TLS",1218197:"TKM",2464461:"TUN",4032283:"TON",298795:"TUR",3573591:"TTO",2110297:"TUV",1668284:"TWN",149590:"TZA",690791:"UKR",226074:"UGA",5854968:"UMI",6252001:"USA",3439705:"URY",1512440:"UZB",3164670:"VAT",3577815:"VCT",3625428:"VEN",3577718:"VGB",4796775:"VIR",1562822:"VNM",2134431:"VUT",4034749:"WLF",4034894:"WSM",69543:"YEM",1024031:"MYT",953987:"ZAF",895949:"ZMB",878675:"ZWE"}
GEO_SAMPLE_SIZE = 10000

#@cache
#Helper
def _geotag_count(query):
    res = mc.sentenceFieldCount('*',query,tag_sets_id=1011,sample_size=GEO_SAMPLE_SIZE)
    countryTags = []
    res = [ r for r in res if int(r['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    for r in res:
        geonamesId = int(r['tag'].split('_')[1])
        if geonamesId not in COUNTRY_GEONAMES_ID_TO_APLHA3.keys():   # only include countries
            continue
        r['geonamesId'] = geonamesId    # TODO: move this to JS?
        r['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonamesId]
        r['count'] = (float(r['count'])/float(GEO_SAMPLE_SIZE))    # WTF: why is the API returning this as a string and not a number?
    return res

@app.route('/api/sources/media-source/<media_id>/geography')
#@flask_login.login_required
def api_media_source_geography(media_id):
    info = {}
    info['geography'] = _geotag_count('media_id:'+str(media_id))
    return jsonify({'results':info})

@app.route('/api/sources/media-tag/<media_tag_id>/geography')
#@flask_login.login_required
def geo_geography(media_tag_id):
    info = {}
    info['geography'] = _geotag_count('tags_id_media:'+str(media_tag_id))
    return jsonify({'results':info})

#@cache
#Helper
def _wordcount(query):
    res = mc.wordCount('*',query,num_words=100,sample_size=5000)
    return res

@app.route('/api/sources/media-source/<media_id>/words')
#@flask_login.login_required
def media_source_words(media_id):
    info = {}
    info['wordcounts'] = _wordcount('media_id:'+str(media_id))
    return jsonify({'results':info})

@app.route('/api/sources/media-tag/<media_tag_id>/words')
#@flask_login.login_required
def media_tag_words(media_tag_id):
    info = {}
    info['wordcounts'] = _wordcount('tags_id_media:'+str(media_tag_id))
    return jsonify({'results':info})
