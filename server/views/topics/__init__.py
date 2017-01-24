import json
import flask_login
from server import app, auth
from flask import jsonify

SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'
CACHED_TOPICS = json.load(open('./server/static/data/all_topics.json'))

def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort

@app.route('/api/topics/fetchMatchingTopics', methods=['GET'])
@flask_login.login_required
def topic_search():
	return jsonify({'list': CACHED_TOPICS['topics']})
