import datetime, logging
from flask_login import UserMixin, AnonymousUserMixin
import mediacloud as mcapi

from mediameter import db, mc

logger = logging.getLogger(__name__)

# User class
class User(UserMixin):
    def __init__(self, username, key, active=True):
        self.name = username
        self.id = key
        self.active = active
        self.created = datetime.datetime.now()
        
    def is_active(self):
        return self.active
    
    def is_anonymous(self):
        return False
    
    def is_authenticated(self):
        return True
    
    def create_in_db_if_needed(self):
        if self.exists_in_db():
            logger.debug("user %s already in db" % self.name)
            return
        logger.debug("user %s created in db" % self.name)
        db.users.insert({'username':self.name})

    def exists_in_db(self):
        return db.users.find_one({'username':self.name}) is not None
    
    @classmethod
    def get(cls, userid):
        try:
            return User.cached[userid]
        except KeyError:
            return None

User.cached = {}

def load_from_db_by_username(username):
    return db.users.find_one({'username':username})

def authenticate_by_key(username, key):
    user_mc = mcapi.MediaCloud(key)
    if user_mc.verifyAuthToken():
        user = User(username, key)
        User.cached[user.id] = user
        return user
    return AnonymousUserMixin()

def authenticate_by_password(username, password):
    logger.debug("user %s want to log in with password" % username)
    try:
        key = mc.userAuthToken(username, password)
        user = User(username, key)
        User.cached[user.id] = user
        return user
    except Exception:
        return AnonymousUserMixin()

