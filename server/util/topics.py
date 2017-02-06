import os, mediacloud, json, ConfigParser

# load the shared settings file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
server_config_file_path = os.path.join(base_dir, '..', 'config', 'server.config')
settings = ConfigParser.ConfigParser()
settings.read(server_config_file_path)
mc = mediacloud.api.MediaCloud(settings.get('mediacloud', 'api_key'))

def cache_topic_list():
	topics_list = open(base_dir + '/static/data/all_topics.json', 'w')
	topics_data = mc.topicList()
	# page through topics
	while 'next' in topics_data['link_ids']:
		next_link_id = topics_data['link_ids']['next']
		next_page = mc.topicList(next_link_id)
		topics_data['topics'] = topics_data['topics'] + next_page['topics']
		topics_data['link_ids'] = next_page['link_ids']
	json.dump(topics_data, topics_list)
