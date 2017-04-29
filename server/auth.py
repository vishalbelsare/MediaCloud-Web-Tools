import datetime
import logging
import flask_login
from flask_login import current_user
import mediacloud
from flask import request

from server import db, mc, login_manager

logger = logging.getLogger(__name__)

COOKIE_USER_KEY = "mediameter_user_key"

ROLE_ADMIN = 'admin'                        # Do everything, including editing users
ROLE_ADMIN_READ_ONLY = 'admin-readonly'     # Read access to admin interface
ROLE_MEDIA_EDIT = 'media-edit'              # Add / edit media; includes feeds
ROLE_STORY_EDIT = 'story-edit'              # Add / edit stories
ROLE_TM = 'tm'                              # Topic mapper; includes media and story editing
ROLE_STORIES_API = 'stories-api'            # Access to the stories api
ROLE_SEARCH = 'search'                      # Access to the /search pages
ROLE_TM_READ_ONLY = 'tm-readonly'           # Topic mapper; excludes media and story editing


# User class
class User(flask_login.UserMixin):

    def __init__(self, username, key, active=True):
        self.name = username
        self.id = key
        self.active = active
        self.created = datetime.datetime.now()
        self.profile = None

    def set_profile(self, profile):
        self.profile = profile

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

    def get_properties(self):
        return {
            'email': self.name,
            'key': self.id,
            'profile': self.profile
        }

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
    '''
    flask-login uses this method to pull the user key in from the flask request
    '''
    if COOKIE_USER_KEY in request_object.cookies:
        return User.get(request_object.cookies[COOKIE_USER_KEY])
    return None


def is_user_logged_in():
    return current_user.is_authenticated


def login_user(user):
    flask_login.login_user(user, remember=True)
    user.create_in_db_if_needed()
    logger.debug("  login succeeded")


def user_has_auth_role(role):
    user = load_user_from_request(request)
    roles = user.profile['auth_roles']
    return (ROLE_ADMIN in roles) or (role in roles)


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
        user.set_profile(_get_user_profile(key))
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
        user.set_profile(_get_user_profile(key))
        return user
    except Exception:
        logging.exception("authenticate_by_password failed for %s", username)
        return flask_login.AnonymousUserMixin()


def _get_user_profile(key):
    user_mc = mediacloud.api.MediaCloud(key)
    profile = user_mc.userProfile()
    return profile


def user_name():
    return load_user_from_request(request).name


def user_mediacloud_key():
    '''
    Return the IP-restricted API token for this user from the cookie (note: this is the server IP)
    '''
    return request.cookies[COOKIE_USER_KEY] if COOKIE_USER_KEY in request.cookies else None


def user_mediacloud_client():
    '''
    Return a mediacloud client for the logged in user
    '''
    user_mc_key = user_mediacloud_key()
    user_mc = mediacloud.api.AdminMediaCloud(user_mc_key)
    return user_mc
