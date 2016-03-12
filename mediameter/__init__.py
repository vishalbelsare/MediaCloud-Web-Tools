import os, logging, ConfigParser
from flask import Flask, render_template, jsonify
from flask_webpack import Webpack

import mediacloud

webpack = Webpack()

# Set up some logging
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logging.basicConfig(filename=os.path.join(base_dir,'logs','server.log'),level=logging.DEBUG)
log = logging.getLogger(__name__)
log.info("---------------------------------------------------------------------------")
requests_logger = logging.getLogger('requests')
requests_logger.setLevel(logging.WARN)
mediacloud_logger = logging.getLogger('mediacloud')
mediacloud_logger.setLevel(logging.DEBUG)

# load the shared settings file
server_config_file_path = os.path.join(base_dir,'server.config')
settings = ConfigParser.ConfigParser()
settings.read(server_config_file_path)

# Connect to MediaCloud
mc = mediacloud.api.AdminMediaCloud(settings.get('mediacloud','api_key'))
log.info("Connection to mediacloud")

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

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/login')
def api_login():
    return jsonify(key='USE_THIS')

