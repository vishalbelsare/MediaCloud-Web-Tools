import json
import logging
import flask_login
from server import app, auth
from flask import jsonify

logger = logging.getLogger(__name__)

SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'

try:
	topics_data = json.load(open('./server/static/data/all_topics.json'))
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

@app.route('/api/topics/fetchFullTopicList', methods=['GET'])
@flask_login.login_required
def topic_search():
	results = {}
	results['topics'] = map(lambda x: {'name': x['name'], 'id': x['topics_id']}, CACHED_TOPICS)
	results['cached'] = IS_CACHED
	return jsonify({'list': results})
