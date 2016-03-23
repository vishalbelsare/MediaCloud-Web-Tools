import datetime, logging
import flask_login
import mediacloud

from mediameter import db, mc, login_manager

logger = logging.getLogger(__name__)

# User class
class User(flask_login.UserMixin):
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

@login_manager.user_loader
def load_user(userid):
    '''
    flask-login uses this method to lookup users to see if they are logged in already
    '''
    logger.debug("trying to load_user %s" % userid)
    return User.get(userid)

def login_user(user):
    flask_login.login_user(user,remember=True)
    user.create_in_db_if_needed()
    logger.debug("  login succeeded")

def create_and_cache_user(username, key):
    user = User(username, key)
    User.cached[user.id] = user
    logger.debug("  added to user cache %s" % user.id)
    return user

def load_from_db_by_username(username):
    return db.users.find_one({'username':username})

def authenticate_by_key(username, key):
    logger.debug("user %s want to log in with key" % username)
    user_mc = mediacloud.MediaCloud(key)
    if user_mc.verifyAuthToken():
        logger.debug("succeeded")
        return create_and_cache_user(username, key)
    logger.debug("failed")
    return flask_login.AnonymousUserMixin()

def authenticate_by_password(username, password):
    logger.debug("user %s want to log in with password" % username)
    try:
        key = mc.userAuthToken(username, password)
        return create_and_cache_user(username, key)
    except Exception:
        return flask_login.AnonymousUserMixin()

