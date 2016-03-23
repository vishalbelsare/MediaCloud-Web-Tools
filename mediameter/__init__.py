import os, logging, ConfigParser
from flask import Flask, render_template
from flask_webpack import Webpack
import pymongo, flask_login, mediacloud

webpack = Webpack()

# Set up some logging
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logging.basicConfig(filename=os.path.join(base_dir,'logs','server.log'),level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.info("---------------------------------------------------------------------------")
flask_login_logger = logging.getLogger('flask_login')
flask_login_logger.setLevel(logging.DEBUG)
#requests_logger = logging.getLogger('requests')
#requests_logger.setLevel(logging.WARN)
#mediacloud_logger = logging.getLogger('mediacloud')
#mediacloud_logger.setLevel(logging.DEBUG)

# load the shared settings file
server_config_file_path = os.path.join(base_dir,'server.config')
settings = ConfigParser.ConfigParser()
settings.read(server_config_file_path)

# Connect to MediaCloud
mc = mediacloud.api.AdminMediaCloud(settings.get('mediacloud','api_key'))
logger.info("Connected to mediacloud")

# Connect to the app's mongo DB
db_host = settings.get('database', 'host')
db_name = settings.get('database', 'name')
db = pymongo.MongoClient(db_host)[db_name]
logger.info("Connected to DB: %s@%s" % (db_name,db_host))

def create_app():
    '''
    Factory method to create the app
    '''
    app = Flask(__name__)
    settings = {
        'DEBUG': True,
        'WEBPACK_MANIFEST_PATH': '../build/manifest.json'
    }
    app.config.update(settings)
    webpack.init_app(app)
    return app

app = create_app()
app.secret_key = settings.get('server','secret_key')

# Create user login manager
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# set up all the views

@app.route('/')
def index():
    logger.debug("homepage request")
    return render_template('index.html')

from views import login, controversies
