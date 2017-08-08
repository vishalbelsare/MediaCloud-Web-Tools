import os
import logging.config
import ConfigParser
import json
import sys
from flask import Flask, render_template
from flask_webpack import Webpack
from flask_mail import Mail
import flask_login
from raven.conf import setup_logging
from raven.contrib.flask import Sentry
from raven.handlers.logging import SentryHandler
import tempfile
import mediacloud
from mediameter.cliff import Cliff

from server.database import AppDatabase

SERVER_MODE_DEV = "dev"
SERVER_MODE_PROD = "prod"

SERVER_APP_TOPICS = "topics"
SERVER_APP_SOURCES = "sources"
SERVER_APP_TOOLS = "tools"
SERVER_APP_EXPLORER = "explorer"

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
    logging.info("no sentry logging")

with open(os.path.join(base_dir, 'config', 'server-logging.json'), 'r') as f:
    logging_config = json.load(f)
    logging_config['handlers']['file']['filename'] = os.path.join(base_dir, logging_config['handlers']['file']['filename'])
logging.config.dictConfig(logging_config)
logger = logging.getLogger(__name__)
logger.info("---------------------------------------------------------------------------")
flask_login_logger = logging.getLogger('flask_login')
flask_login_logger.setLevel(logging.DEBUG)

server_mode = settings.get('server', 'mode').lower()
if server_mode not in [SERVER_MODE_DEV, SERVER_MODE_PROD]:
    logger.error("Unknown server mode '%s', set a mode in the `config/server.config` file", server_mode)
    sys.exit(1)
else:
    logger.info("Started server in %s mode", server_mode)

# Connect to MediaCloud
TOOL_API_KEY = settings.get('mediacloud', 'api_key')

mc = mediacloud.api.AdminMediaCloud(TOOL_API_KEY)
logger.info("Connected to mediacloud")

# Connect to CLIFF if the settings are there
cliff = None
try:
    cliff = Cliff(settings.get('cliff', 'host'), settings.get('cliff', 'port'))
except Exception:
    logger.warn("no CLIFF connection")

# Connect to the app's mongo DB
db_host = settings.get('database', 'host')
db_name = settings.get('database', 'name')
db = AppDatabase(db_host, db_name)

try:
    db.check_connection()
except Exception as err:
    print("DB error: {0}".format(err))
    print("Make sure Mongo is running")
    sys.exit()

logger.info("Connected to DB: %s@%s", db_name, db_host)


def is_dev_mode():
    return server_mode == SERVER_MODE_DEV


def is_prod_mode():
    return server_mode == SERVER_MODE_PROD

webpack = Webpack()
mail = Mail()


def create_app():
    # Factory method to create the app
    prod_app_name = settings.get('server', 'app')
    my_app = Flask(__name__)
    # set up uploading
    my_app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # 1MB
    my_app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()
    # set up webpack
    if is_dev_mode():
        manifest_path = '../build/manifest.json'
    else:
        manifest_path = '../server/static/gen/{}/manifest.json'.format(prod_app_name)
    webpack_config = {
        'DEBUG': is_dev_mode(),
        'WEBPACK_MANIFEST_PATH': manifest_path
    }
    if is_prod_mode():
        webpack_config['WEBPACK_ASSETS_URL'] = 'https://d2h2bu87t9cnlp.cloudfront.net/static/gen/{}/'.format(prod_app_name)
    my_app.config.update(webpack_config)
    webpack.init_app(my_app)
    # set up mail sending
    if settings.has_option('smtp', 'enabled'):
        mail_enabled = settings.get('smtp', 'enabled')
        if mail_enabled is '1':
            mail_config = {     # @see https://pythonhosted.org/Flask-Mail/
                'MAIL_SERVER': settings.get('smtp', 'server'),
                'MAIL_PORT': settings.get('smtp', 'port'),
                'MAIL_USE_SSL': settings.get('smtp', 'use_ssl'),
                'MAIL_USERNAME': settings.get('smtp', 'username'),
                'MAIL_PASSWORD': settings.get('smtp', 'password'),
            }
            my_app.config.update(mail_config)
            mail.init_app(my_app)
            logger.info('Mailing from '+settings.get('smtp', 'username')+' via '+settings.get('smtp', 'server'))
        else:
            logger.info("Mail configured, but not enabled")
    else: 
        logger.info("No mail configured")
    return my_app

app = create_app()
app.secret_key = settings.get('server', 'secret_key')

# Create user login manager
login_manager = flask_login.LoginManager()
login_manager.init_app(app)


# set up all the views
@app.route('/')
def index():
    logger.debug("homepage request")
    return render_template('index.html')

# now load in the appropriate view endpoints, after the app has been initialized
import server.views.user
import server.views.stat
import server.views.sources.search
import server.views.notebook.management
server_app = settings.get('server', 'app')
if (server_app == SERVER_APP_SOURCES) or is_dev_mode():
    import server.views.sources.collection
    import server.views.sources.collectionedit
    import server.views.sources.source
    import server.views.sources.feeds
    import server.views.sources.suggestions
    import server.views.sources.sentences
    import server.views.sources.words
    import server.views.sources.geocount
    import server.views.sources.metadata
if (server_app == SERVER_APP_TOPICS) or is_dev_mode():
    import server.views.topics.media
    import server.views.topics.sentences
    import server.views.topics.stories
    import server.views.topics.topic
    import server.views.topics.words
    import server.views.topics.focalsets
    import server.views.topics.foci
    import server.views.topics.permissions
    import server.views.topics.maps
    import server.views.topics.nyttags
    import server.views.topics.geotags
    import server.views.topics.topiccreate
if (server_app == SERVER_APP_EXPLORER) or is_dev_mode():
    import server.views.explorer.explorer_query
    import server.views.explorer.search
    import server.views.explorer.sentences
    import server.views.explorer.stories
    import server.views.explorer.geo
