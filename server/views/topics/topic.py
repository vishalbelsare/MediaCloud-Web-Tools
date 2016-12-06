import logging
from flask import jsonify, request
import flask_login

from server import app, db
from server.util.mail import send_email
from server.util.request import form_fields_required, api_error_handler
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name
from server.views.topics.apicache import topic_sentence_counts, topic_focal_sets, cached_topic_timespan_list

logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_list():
    user_mc = user_mediacloud_client()
    link_id = request.args.get('linkId')
    all_topics = user_mc.topicList(link_id=link_id)
    _add_user_favorite_flag_to_topics(all_topics['topics'])
    return jsonify(all_topics)

@app.route('/api/topics/<topics_id>/summary', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_summary(topics_id):
    user_mc = user_mediacloud_client()
    topic = user_mc.topic(topics_id)
    _add_user_favorite_flag_to_topics([topic])
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
    return jsonify({'list':snapshots})

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
    return jsonify({'topics': favorited_topics})

@app.route('/api/topics/<topics_id>/update', methods=['PUT'])
@flask_login.login_required
@form_fields_required('name', 'description', 'public')
@api_error_handler
def topic_update(topics_id):
    return topic_summary(topics_id) # give them back new data, so they can update the client

@app.route('/api/topics/suggest', methods=['PUT'])
@flask_login.login_required
@form_fields_required('name', 'description', 'seedQuery', 'reason', 'spidered')
@api_error_handler
def topic_suggest():
    send_email('topics@mediacloud.org', 'rahulbot@gmail.com', 'Hi', 'test msg')
    return jsonify({'success': 1})
