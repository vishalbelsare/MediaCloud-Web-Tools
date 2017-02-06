import sys, os

# have to manipulate path to run this from scripts folder for lack of a better method
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
server_util_dir_path = os.path.join(base_dir, 'server', 'util')
sys.path.append(server_util_dir_path)
import topics

topics.cache_topic_list()
