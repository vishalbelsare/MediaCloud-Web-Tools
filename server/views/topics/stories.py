import logging
import json
from flask import jsonify, request
import flask_login
from operator import itemgetter

from server import app, cliff, mc, TOOL_API_KEY
from server.auth import is_user_logged_in
from server.cache import cache
import server.util.csv as csv
import server.util.tags as tag_util
from server.util.request import api_error_handler
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, user_mediacloud_client
from server.views.topics.apicache import topic_story_count, topic_story_list, topic_word_counts
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)

PRIMARY_ENTITY_TYPES = ['PERSON', 'LOCATION', 'ORGANIZATION']

@app.route('/api/topics/<topics_id>/stories/<stories_id>', methods=['GET'])
@api_error_handler
def story(topics_id, stories_id):

    local_mc = None
    if access_public_topic(topics_id):
        local_mc = mc
        story_topic_info = topic_story_list(TOOL_API_KEY, topics_id, stories_id=stories_id)['stories'][0]
    elif is_user_logged_in():
        local_mc = user_mediacloud_client()
        story_topic_info = topic_story_list(user_mediacloud_key(), topics_id, stories_id=stories_id)['stories'][0]
        '''
        all_fb_count = []
        more_fb_count = True
        link_id = 0
        while more_fb_count:
            fb_page = local_mc.topicStoryListFacebookData(topics_id, limit=100, link_id=link_id)

            all_fb_count = all_fb_count + fb_page['counts']
            if 'next' in fb_page['link_ids']:
                link_id = fb_page['link_ids']['next']
                more_fb_count = True
            else:
                more_fb_count = False
   
        for fb_item in all_fb_count:
            if int(fb_item['stories_id']) == int(stories_id):
                story_topic_info['facebook_collection_date'] = fb_item['facebook_api_collect_date']
        '''
    else:
        return jsonify({'status':'Error', 'message': 'Invalid attempt'})

    
    story_info = local_mc.story(stories_id)  # add in other fields from regular call
    for k in story_info.keys():
        if k not in story_topic_info.keys():
            story_topic_info[k] = story_info[k]
    for tag in story_info['story_tags']:
        if tag['tag_sets_id'] == tag_util.GEO_TAG_SET:
            geonames_id = int(tag['tag'][9:])
            try:
                tag['geoname'] = _cached_geoname(geonames_id)
            except Exception as e:
                # query to CLIFF failed :-( handle it gracefully
                logger.exception(e)
                tag['geoname'] = {}
    return jsonify(story_topic_info)


@cache
def _cached_geoname(geonames_id):
    return cliff.geonamesLookup(geonames_id)


@app.route('/api/topics/<topics_id>/stories/counts', methods=['GET'])
@api_error_handler
def story_counts(topics_id):
    local_key = None
    if access_public_topic(topics_id):
        local_key = TOOL_API_KEY
    elif is_user_logged_in():
        local_key = user_mediacloud_key()
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    total = topic_story_count(local_key, topics_id, timespans_id=None, q=None)
    filtered = topic_story_count(local_key, topics_id)  # force a count with just the query
    return jsonify({'counts': {'count': filtered['count'], 'total': total['count']}})


@app.route('/api/topics/<topics_id>/stories/undateable-counts', methods=['GET'])
@api_error_handler
def story_undateable_count(topics_id):
    q = "tags_id_stories:{}".format(tag_util.STORY_UNDATEABLE_TAG)
    return _public_safe_topic_story_count(topics_id, q)


def _add_to_user_query(query_to_add):
    q_from_request = request.args.get('q')
    combined_query = q_from_request
    if (q_from_request is not None) and (len(q_from_request) > 0) and (query_to_add is not None):
        combined_query = "({}) AND ({})".format(q_from_request, query_to_add)
    return combined_query


@app.route('/api/topics/<topics_id>/stories/english-counts', methods=['GET'])
@api_error_handler
def story_english_counts(topics_id):
    q = "language:en"
    return _public_safe_topic_story_count(topics_id, q)


def _public_safe_topic_story_count(topics_id, q):
    if access_public_topic(topics_id):
        total = topic_story_count(TOOL_API_KEY, topics_id, q=_add_to_user_query(None))
        matching = topic_story_count(TOOL_API_KEY, topics_id, q=_add_to_user_query(q))  # force a count with just the query
    elif is_user_logged_in():
        total = topic_story_count(user_mediacloud_key(), topics_id, q=_add_to_user_query(None))
        matching = topic_story_count(user_mediacloud_key(), topics_id, q=_add_to_user_query(q))  # force a count with just the query
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify({'counts': {'count': matching['count'], 'total': total['count']}})


@app.route('/api/topics/<topics_id>/stories/<stories_id>/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_words(topics_id, stories_id):
    word_list = topic_word_counts(user_mediacloud_key(), topics_id, q='stories_id:'+stories_id)[:100]
    return jsonify(word_list)


@app.route('/api/topics/<topics_id>/stories/<stories_id>/words.csv', methods=['GET'])
@flask_login.login_required
def story_words_csv(topics_id, stories_id):
    word_list = topic_word_counts(user_mediacloud_key(), topics_id, q='stories_id:'+stories_id)
    props = ['term', 'stem', 'count']
    return csv.stream_response(word_list, props, 'story-'+str(stories_id)+'-words')


@app.route('/api/topics/<topics_id>/stories/<stories_id>/inlinks', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_inlinks(topics_id, stories_id):
    inlinks = topic_story_list(user_mediacloud_key(), topics_id, link_to_stories_id=stories_id)
    return jsonify(inlinks)


@app.route('/api/topics/<topics_id>/stories/<stories_id>/inlinks.csv', methods=['GET'])
@flask_login.login_required
def story_inlinks_csv(topics_id, stories_id):
    return stream_story_list_csv(user_mediacloud_key(), 'story-'+stories_id+'-inlinks', topics_id, link_to_stories_id=stories_id)


@app.route('/api/topics/<topics_id>/stories/<stories_id>/outlinks', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_outlinks(topics_id, stories_id):
    outlinks = topic_story_list(user_mediacloud_key(), topics_id, link_from_stories_id=stories_id)
    return jsonify(outlinks)


@app.route('/api/topics/<topics_id>/stories/<stories_id>/outlinks.csv', methods=['GET'])
@flask_login.login_required
def story_outlinks_csv(topics_id, stories_id):
    return stream_story_list_csv(user_mediacloud_key(), 'story-'+stories_id+'-outlinks', topics_id, link_from_stories_id=stories_id)


@app.route('/api/topics/<topics_id>/stories', methods=['GET'])
@api_error_handler
@api_error_handler
def topic_stories(topics_id):
    local_mc = None
    if access_public_topic(topics_id):
        stories = topic_story_list(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None, foci_id=None, q=None)
    elif is_user_logged_in():
        stories = topic_story_list(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status':'Error', 'message': 'Invalid attempt'})

    return jsonify(stories)


@app.route('/api/topics/<topics_id>/stories.csv', methods=['GET'])
@flask_login.login_required
def topic_stories_csv(topics_id):
    as_attachment = True
    fb_data = False
    if ('attach' in request.args):
        as_attachment = request.args['attach'] == 1
    if ('fbData' in request.args):
        fb_data = int(request.args['fbData']) == 1
    user_mc = user_admin_mediacloud_client()
    topic = user_mc.topic(topics_id)
    return stream_story_list_csv(user_mediacloud_key(), topic['name']+'-stories', topics_id, as_attachment=as_attachment, fb_data=fb_data)


def stream_story_list_csv(user_mc_key, filename, topics_id, **kwargs):
    '''
    Helper method to stream a list of stories back to the client as a csv.  Any args you pass in will be
    simply be passed on to a call to topicStoryList.
    '''
    as_attachment = kwargs['as_attachment'] if 'as_attachment' in kwargs else True
    fb_data = kwargs['fb_data'] if 'fb_data' in kwargs else False
    all_stories = []
    more_stories = True
    params = kwargs
    if 'as_attachment' in params:
        del params['as_attachment']
    if 'fb_data' in params:
        del params['fb_data']

    params['limit'] = 1000  # an arbitrary value to let us page through with big pages
    props = ['stories_id', 'publish_date', 'date_is_reliable', 
            'title', 'url', 'media_id', 'media_name',
            'media_inlink_count', 'inlink_count', 'outlink_count', 'bitly_click_count',
             'facebook_share_count', 'language', 'subtopics', 'themes']
    user_mc = user_mediacloud_client()
    try:
        while more_stories:
            page = topic_story_list(user_mc_key, topics_id, **params)
            # need to make another call to fetch the tags :-(
            story_ids = [str(s['stories_id']) for s in page['stories']]
            stories_with_tags = user_mc.storyList('stories_id:('+" ".join(story_ids)+")", rows=kwargs['limit'])
            story_ids_to_tags = {int(s['stories_id']): s['story_tags'] for s in stories_with_tags}
            for s in page['stories']:
                s['themes'] = '?'  # means we haven't processed it for themes yet
                s['subtopics'] = '?'  # fill it in for safety
                stories_id = s['stories_id']
                if stories_id in story_ids_to_tags:
                    story_tags = story_ids_to_tags[stories_id]
                    story_tag_ids = [t['tags_id'] for t in story_tags]
                    # add in the names of any themes
                    if tag_util.NYT_LABELER_1_0_0_TAG_ID in story_tag_ids:
                        s['themes'] = ",".join([t['tag'] for t in story_tags
                                                if t['tag_sets_id'] == tag_util.NYT_LABELS_TAG_SET_ID])
                    # not doing geonames places here because it would take too long to fetch the name with `_cached_geonames`
                # add in the names of any subtopics
                foci_names = [f['name'] for f in s['foci']]
                s['subtopics'] = ",".join(foci_names)
            all_stories = all_stories + page['stories']
            if 'next' in page['link_ids']:
                params['link_id'] = page['link_ids']['next']
                more_stories = True
            else:
                more_stories = False

        if fb_data:
            all_fb_count = []
            more_fb_count = True
            link_id = 0
            local_mc = user_admin_mediacloud_client()
            while more_fb_count:
                fb_page = local_mc.topicStoryListFacebookData(topics_id, limit=100, link_id=link_id)

                all_fb_count = all_fb_count + fb_page['counts']
                if 'next' in fb_page['link_ids']:
                    link_id = fb_page['link_ids']['next']
                    more_fb_count = True
                else:
                    more_fb_count = False
   
            # now iterate through each list and set up the fb collection date
            for story in all_stories:
              for fb_item in all_fb_count:
                if int(fb_item['stories_id']) == int(story['stories_id']):
                    story['facebook_collection_date'] = fb_item['facebook_api_collect_date']
            props.append('facebook_collection_date')


        return csv.stream_response(all_stories, props, filename, as_attachment=as_attachment)

    except Exception as e:
        logger.exception(e)
        return json.dumps({'error': str(e)}, separators=(',', ':')), 400


@app.route('/api/topics/<topics_id>/stories/<stories_id>/entities', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_entities(topics_id, stories_id):
    # we don't care about money, number, duration, date, misc, ordinal
    entities = cached_entities(user_mediacloud_key(), stories_id)
    if entities is not None:
        entities = [e for e in entities if e['type'] in PRIMARY_ENTITY_TYPES ]
    return jsonify({'list': entities})


@app.route('/api/topics/<topics_id>/stories/<stories_id>/entities.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story_entities_csv(topics_id, stories_id):
    # in the download include all entity types
    entities = cached_entities(user_mediacloud_key(), stories_id)
    if entities is None:
        # none means not processed by corenlp, but for download just make it empty
        entities = []
    props = ['type', 'name', 'words']
    return csv.stream_response(entities, props, 'story-'+str(stories_id)+'-entities')

def cached_entities(user_mediacloud_key, stories_id):
    user_mc = user_mediacloud_client()
    nlp_results = user_mc.storyCoreNlpList(story_id_list=[stories_id])
    if nlp_results[0]['corenlp'] == "story is not annotated":
        return None
    story_nlp = nlp_results[0]['corenlp']['_']['corenlp']
    # set up for entity counting
    entities = []
    current_entity_words = []
    current_entity_type = None  # entities can be split across multiple consecutive words
    # iterate through the words collecting any named entities
    for sentence in story_nlp['sentences']:
        for token in sentence['tokens']:
            if (len(token['ne']) > 1):
                current_entity_type = token['ne']
                current_entity_words.append(token['word'])
            else:  # found a non-entity, so check if the preceeding word(s) were an entity and add it to the mix
                if current_entity_type is not None:
                    entities.append({'type': current_entity_type,
                                     'name': " ".join(current_entity_words),
                                     'words': len(current_entity_words)})
                current_entity_words = []
                current_entity_type = None
    # turn the lists into counts
    unique_entities = {}
    for entity in entities:
        unique_key = entity['type'] + entity['name'] + str(entity['words'])
        if unique_key in unique_entities.keys():
            unique_entities[unique_key]['frequency'] += 1
        else:
            unique_entities[unique_key] = entity
            unique_entities[unique_key]['frequency'] = 1
    unique_entities = list(unique_entities.values())
    unique_entities = sorted(unique_entities, key=itemgetter('frequency'), reverse=True)
    return unique_entities
