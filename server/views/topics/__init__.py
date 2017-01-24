from server.auth import is_user_logged_in
from server import mc
SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'

def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort

def topic_is_public(topics_id):
    topic = mc.topic(topics_id)
    is_public = topic['is_public']
    # return bool(is_public)
    return True

def access_public_topic(topics_id):
	# check whether logged in here since it is a requirement for public access
	if ((not is_user_logged_in()) and (topic_is_public(topics_id))):
		return True
	return False
