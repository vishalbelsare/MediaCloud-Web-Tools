import datetime
import logging
from pymongo import MongoClient
from bson.objectid import ObjectId

DB_NAME = 'mediacloud-app'  # use one standard name everywhere for simplicity

logger = logging.getLogger(__name__)


class AppDatabase():
    '''
    DB wrapper for accessing local storge that supports the app.
    In theory this makes switching out storage backends easier, by gauranteeing _conn is private.
    '''

    def __init__(self, db_uri):
        self.uri = db_uri
        self.created = datetime.datetime.now()
        self._conn = MongoClient(db_uri)[DB_NAME]

    def check_connection(self):
        return self._conn.test.insert({'dummy': 'test'})

    def includes_user_named(self, username):
        return self.find_by_username(username) is not None

    def add_user_named(self, username):
        return self._conn.users.insert({'username': username, 'favoriteTopics': [], 'favoriteSources': [], 'favoriteCollections': [], 'savedQueries': []})

    def find_by_username(self, username):
        return self._conn.users.find_one({'username': username})

    def get_users_lists(self, username, list_name):
        user_data = self.find_by_username(username)
        if list_name in user_data:
            return user_data[list_name]
        # be a little safe about checking for lists
        return []

    def add_item_to_users_list(self, username, list_name, item):
        return self._conn.users.update_one({'username': username}, {'$push': {list_name: item}})

    def remove_item_from_users_list(self, username, list_name, item):
        return self._conn.users.update_one({'username': username}, {'$pull': {list_name: item}})

    def save_notebook_entry(self, username, entry):
        return self._conn.notebook.insert({
            'username': username,
            'createdDate': datetime.datetime.now(),
            'entry': entry
        })

    def load_notebook_entry(self, entry_id):
        return self._conn.users.find_one({'_id': ObjectId(entry_id)})
