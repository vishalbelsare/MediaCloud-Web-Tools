import os
import logging
import logging.config
import ConfigParser
import json
import sys
from flask import Flask, render_template
from flask_webpack import Webpack
import pymongo
import flask_login
from flask_cors import CORS
from raven.conf import setup_logging
from raven.contrib.flask import Sentry
from raven.handlers.logging import SentryHandler
import mediacloud

from server.database import AppDatabase

SERVER_MODE_DEV = "DEV"
SERVER_MODE_PROD = "PROD"
SERVER_APP_TOPICS = "topics"
SERVER_APP_SOURCES = "sources"

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# load the shared settings file
server_config_file_path = os.path.join(base_dir, 'config', 'server.config')
settings = ConfigParser.ConfigParser()
settings.read(server_config_file_path)

# Set up some logging
try:
    entry = Sentry(dsn=settings.get('sentry', 'dsn'))
    handler = SentryHandler(settings.get('sentry', 'dsn'))
    setup_logging(handler)
except Exception:
    print "no sentry logging"

with open(os.path.join(base_dir, 'config', 'server-logging.json'), 'r') as f:
    logging_config = json.load(f)
    logging_config['handlers']['file']['filename'] = os.path.join(base_dir, logging_config['handlers']['file']['filename'])
logging.config.dictConfig(logging_config)
logger = logging.getLogger(__name__)
logger.info("---------------------------------------------------------------------------")
flask_login_logger = logging.getLogger('flask_login')
flask_login_logger.setLevel(logging.DEBUG)

server_mode = settings.get('server', 'mode')
if server_mode not in [SERVER_MODE_DEV, SERVER_MODE_PROD]:
    logger.error("Unknown server mode '%s', set a mode in the `config/server.config` file", server_mode)
    sys.exit(1)
else:
    logger.info("Started server in %s mode", server_mode)

# Connect to MediaCloud
mc = mediacloud.api.AdminMediaCloud(settings.get('mediacloud', 'api_key'))
logger.info("Connected to mediacloud")

# Connect to the app's mongo DB
db_host = settings.get('database', 'host')
db_name = settings.get('database', 'name')
db = AppDatabase(db_host, db_name)
logger.info("Connected to DB: %s@%s", db_name, db_host)

def isDevMode():
    return server_mode == SERVER_MODE_DEV

def isProdMode():
    return server_mode == SERVER_MODE_PROD

webpack = Webpack()

def create_app():
    '''
    Factory method to create the app
    '''
    prod_app = settings.get('server', 'app')
    my_app = Flask(__name__)
    webpack_config = {
        'DEBUG': isDevMode(),
        'WEBPACK_MANIFEST_PATH': '../build/manifest.json' if isDevMode() else '../server/static/gen/'+prod_app+'/manifest.json'
    }
    my_app.config.update(webpack_config)
    webpack.init_app(my_app)
    return my_app

app = create_app()
app.secret_key = settings.get('server', 'secret_key')

CORS(app,
    resources=r'/*',
    supports_credentials=True,
    allow_headers='Content-Type'
)

# Create user login manager
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# set up all the views

@app.route('/')
def index():
    logger.debug("homepage request")
    return render_template('index.html')

# now load in the appropriate view endpoints (only on Prod)
import server.views.user
server_app = settings.get('server', 'app')
if (server_app == SERVER_APP_SOURCES) or isDevMode():
    import server.views.sources.collection
    import server.views.sources.source
    import server.views.sources.sentences
    import server.views.sources.words
    import server.views.sources.geocount
if (server_app == SERVER_APP_TOPICS) or isDevMode():
    import server.views.topics.media
    import server.views.topics.sentences
    import server.views.topics.stories
    import server.views.topics.topic
    import server.views.topics.words
    import server.views.topics.focalsets
    import server.views.topics.foci
    import server.views.topics.permissions
