# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login

from server import app, db, mc
from server.cache import cache
from server.util.common import _tag_ids_from_collections_param, _media_ids_from_sources_param, _media_tag_ids_from_collections_param
from server.util.mail import send_email
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name, is_user_logged_in
from server.views.topics.apicache import cached_topic_timespan_list
from server.views.topics import access_public_topic, CACHED_TOPICS


logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
@api_error_handler
def topic_list():
    if (not is_user_logged_in()):
        return public_topic_list(CACHED_TOPICS)
    else:
        user_mc = user_mediacloud_client()
        link_id = request.args.get('linkId')
        all_topics = user_mc.topicList(link_id=link_id)
        _add_user_favorite_flag_to_topics(all_topics['topics'])
    return jsonify(all_topics)

@app.route('/api/topics/listFilterCascade', methods=['GET'])
@api_error_handler
def topic_filter_cascade_list():

    #get public topics
    sorted_public_topics = sorted_public_topic_list(CACHED_TOPICS)

    for t in sorted_public_topics:
        t['detailInfo'] = get_topic_info_per_snapshot_timespan(t['topics_id'])

    #check if user had favorites or personal
    all_topics = []
    favorited_topics = []
    if (is_user_logged_in()):
        user_mc = user_mediacloud_client()
        link_id = request.args.get('linkId')
        all_topics = user_mc.topicList(link_id=link_id)

        user_favorited = db.get_users_lists(user_name(), 'favoriteTopics')

        for t in all_topics['topics']:
            t['detailInfo'] = get_topic_info_per_snapshot_timespan(t['topics_id'])
            if len(user_favorited) > 0 and t['topics_id'] in user_favorited:
                t['isFavorite'] = True
                favorited_topics.append(t)

        for t in sorted_public_topics:
            if len(user_favorited) > 0 and t['topics_id'] in user_favorited:
                t['isFavorite'] = True
                favorited_topics.append(t)
    #return it all together
    return jsonify({'topics': { 'favorite': favorited_topics, 'personal': all_topics, 'public': sorted_public_topics}})

def sorted_public_topic_list(topic_list):
    all_public_topics = []
    for topic in topic_list:
        if (topic['is_public'] == 1):
            all_public_topics.append(topic)
    return sorted(all_public_topics, key=lambda t: t['name'].lower())

def public_topic_list(topic_list):
    public_topics = sorted_public_topics(topic_list)
    return jsonify({"topics": public_topics})


@app.route('/api/topics/<topics_id>/summary', methods=['GET'])
@api_error_handler
def topic_summary(topics_id):
    local_mc = None
    if access_public_topic(topics_id):
        local_mc = mc
    elif is_user_logged_in():
        local_mc = user_mediacloud_client()
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    topic = local_mc.topic(topics_id)
    # add in snapshot and latest snapshot job status
    topic['snapshots'] = {
        'list': local_mc.topicSnapshotList(topics_id),
        'jobStatus': mc.topicSnapshotGenerateStatus(topics_id)['job_states']    # need to know if one is running
    }
    if is_user_logged_in():
        _add_user_favorite_flag_to_topics([topic])
    # test topic state error msgs
    # topic['state'] = 'running'  # 'error'
    # topic['message'] = 'it is all fed up'
    # test topic snapshot job status
    # topic['snapshots']['jobStatus'][0]['state'] = 'error' # 'queued', 'running', 'error', 'completed'
    # topic['snapshots']['list'][0]['state'] = 'completed'
    # topic['snapshots']['list'][0]['searchable'] = 0
    return jsonify(topic)


def _add_user_favorite_flag_to_topics(topics):
    user_favorited = db.get_users_lists(user_name(), 'favoriteTopics')
    for t in topics:
        t['isFavorite'] = t['topics_id'] in user_favorited
    return topics


@app.route('/api/topics/<topics_id>/snapshots/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_snapshots_list(topics_id):
    user_mc = user_mediacloud_client()
    snapshots = user_mc.topicSnapshotList(topics_id)
    snapshot_status = mc.topicSnapshotGenerateStatus(topics_id)['job_states']    # need to know if one is running
    return jsonify({'list': snapshots, 'jobStatus': snapshot_status})

@app.route('/api/topics/<topics_id>/snapshots/generate', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_snapshot_generate(topics_id):
    user_mc = user_mediacloud_client()
    results = user_mc.topicGenerateSnapshot(topics_id)
    return jsonify(results)

@app.route('/api/topics/<topics_id>/snapshots/<snapshots_id>/timespans/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_timespan_list(topics_id, snapshots_id):
    foci_id = request.args.get('focusId')
    timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id, foci_id)
    return jsonify({'list':timespans})

@app.route('/api/topics/<topics_id>/favorite', methods=['PUT'])
@flask_login.login_required
@form_fields_required('favorite')
@api_error_handler
def topic_set_favorited(topics_id):
    favorite = request.form["favorite"]
    username = user_name()
    if int(favorite) == 1:
        db.add_item_to_users_list(username, 'favoriteTopics', int(topics_id))
    else:
        db.remove_item_from_users_list(username, 'favoriteTopics', int(topics_id))
    return jsonify({'isFavorite':favorite})

@app.route('/api/topics/favorite', methods=['GET'])
@flask_login.login_required
@api_error_handler
def favorite_topics():
    user_mc = user_mediacloud_client()
    user_favorited = db.get_users_lists(user_name(), 'favoriteTopics')
    favorited_topics = [user_mc.topic(topic_id) for topic_id in user_favorited]
    for t in favorited_topics:
        t['isFavorite'] = True
        t['detailInfo'] = get_topic_info_per_snapshot_timespan(t['topics_id'])
    return jsonify({'topics': favorited_topics})

@app.route('/api/topics/public', methods=['GET'])
@api_error_handler
@cache
def cached_public_topics():
    return public_topic_list();


def get_topic_info_per_snapshot_timespan(topic_id):
    local_mc = user_mediacloud_client()
    snapshots = {
        'list': local_mc.topicSnapshotList(topic_id),
        'jobStatus': local_mc.topicSnapshotGenerateStatus(topic_id)['job_states']    # need to know if one is running
    }
    most_recent_running_snapshot = {}
    overall_timespan = {}
    for snp in snapshots['list']:
        if snp['searchable'] == 1 and snp['state'] == "completed":
            most_recent_running_snapshot = snp
            timespans = cached_topic_timespan_list(user_mediacloud_key(), topic_id, most_recent_running_snapshot['snapshots_id'])
            for ts in timespans:
                if ts['period'] == "overall":
                   overall_timespan = ts

    return {'snapshot': most_recent_running_snapshot, 'timespan': overall_timespan}



@app.route('/api/topics/create', methods=['PUT'])
@flask_login.login_required
@form_fields_required('name', 'description', 'solr_seed_query', 'start_date','end_date')
@api_error_handler
def topic_create():
    user_mc = user_mediacloud_client()
    name = request.form['name']
    description = request.form['description']
    solr_seed_query = request.form['solr_seed_query']
    start_date = request.form['start_date']
    end_date = request.form['end_date']

    optional_args = {
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
        'ch_monitor_id': request.form['ch_monitor_id'] if len(request.form['ch_monitor_id']) > 0 and request.form['ch_monitor_id'] != 'null' else None,
        'max_iterations': request.form['max_iterations'] if 'max_iterations' in request.form else None,
        'twitter_topics_id': request.form['twitter_topics_id'] if 'twitter_topics_id' in request.form else None, 
    }

    # parse out any sources and collections to add
    media_ids_to_add = _media_ids_from_sources_param(request.form['sources[]'])
    tag_ids_to_add = _media_tag_ids_from_collections_param(request.form['collections[]'])

    topic_result = user_mc.topicCreate(name=name, description=description, solr_seed_query=solr_seed_query,
                                       start_date=start_date, end_date=end_date, media_ids=media_ids_to_add,
                                       media_tags_ids=tag_ids_to_add, **optional_args)['topics'][0]

    topic_id = topic_result['topics_id']
    spider_job = user_mc.topicSpider(topic_id)  # kick off a spider, which will also generate a snapshot
    results = user_mc.topic(topic_id)
    results['spider_job_state'] = spider_job

    return jsonify(results)  # give them back new data, so they can update the client


@app.route('/api/topics/<topics_id>/update', methods=['PUT'])
@flask_login.login_required
# require any fields?
@form_fields_required('name', 'description', 'solr_seed_query', 'start_date', 'end_date')
@api_error_handler
def topic_update(topics_id):

    user_mc = user_mediacloud_client()
    # top five cannot be empty fyi
    args = {
        'name': request.form['name'],
        'description': request.form['description'],
        'solr_seed_query': request.form['solr_seed_query'],
        'start_date': request.form['start_date'],
        'end_date': request.form['end_date'],
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
        'ch_monitor_id': request.form['ch_monitor_id'] if len(request.form['ch_monitor_id']) > 0 and request.form['ch_monitor_id'] != 'null' else None,
        'max_iterations': request.form['max_iterations'] if 'max_iterations' in request.form else None,
        'twitter_topics_id': request.form['twitter_topics_id'] if 'twitter_topics_id' in request.form else None, 
    }

    # parse out any sources and collections to add
    media_ids_to_add = _media_ids_from_sources_param(request.form['sources[]'])
    tag_ids_to_add = _media_tag_ids_from_collections_param(request.form['collections[]'])
    # hack to support twitter-only topics
    if (len(media_ids_to_add) is 0) and (len(tag_ids_to_add) is 0):
        media_ids_to_add = None
        tag_ids_to_add = None

    result = user_mc.topicUpdate(topics_id,  media_ids=media_ids_to_add, media_tags_ids=tag_ids_to_add, **args)

    return topic_summary(result['topics'][0]['topics_id']) # give them back new data, so they can update the client
