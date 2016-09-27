import datetime
import logging
import flask_login
import mediacloud
from flask import request

from server import db, mc, login_manager

logger = logging.getLogger(__name__)

COOKIE_USER_KEY = "mediameter_user_key"

# User class
class User(flask_login.UserMixin):

    def __init__(self, username, key, active=True):
        self.name = username
        self.id = key
        self.active = active
        self.created = datetime.datetime.now()

    def is_active(self):
        return self.active

    @property
    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def create_in_db_if_needed(self):
        if self.exists_in_db():
            logger.debug("user %s already in db", self.name)
            return
        logger.debug("user %s created in db", self.name)
        db.add_user_named(self.name)

    def exists_in_db(self):
        return db.includes_user_named(self.name)

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
    logger.debug("trying to load_user %s", userid)
    return User.get(userid)

@login_manager.request_loader
def load_user_from_request(request_object):
    if COOKIE_USER_KEY in request_object.cookies:
        return User.get(request_object.cookies[COOKIE_USER_KEY])
    return None

def login_user(user):
    flask_login.login_user(user, remember=True)
    user.create_in_db_if_needed()
    logger.debug("  login succeeded")

def create_and_cache_user(username, key):
    user = User(username, key)
    User.cached[user.id] = user
    logger.debug("  added to user cache %s", user.id)
    return user

def load_from_db_by_username(username):
    return db.find_by_username(username)

def authenticate_by_key(username, key):
    logger.debug("user %s want to log in with key", username)
    user_mc = mediacloud.MediaCloud(key)
    if user_mc.verifyAuthToken():
        user = create_and_cache_user(username, key)
        logger.debug("  succeeded - got a key (user.is_anonymous=%s)", user.is_anonymous)
        return user
    logger.debug("failed")
    return flask_login.AnonymousUserMixin()

def authenticate_by_password(username, password):
    logger.debug("user %s want to log in with password", username)
    try:
        key = mc.userAuthToken(username, password)
        user = create_and_cache_user(username, key)
        logger.debug("  succeeded - got a key (user.is_anonymous=%s)", user.is_anonymous)
        return user
    except Exception:
        logging.exception("authenticate_by_password failed for %s", username)
        return flask_login.AnonymousUserMixin()

def user_mediacloud_key():
    return request.cookies[COOKIE_USER_KEY]

def user_mediacloud_client():
    '''
    Return a mediacloud client for the logged in user
    '''
    user_mc_key = user_mediacloud_key()
    user_mc = mediacloud.api.MediaCloud(user_mc_key)
    return user_mc
