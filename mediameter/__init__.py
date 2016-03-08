from flask import Flask, render_template
from flask_webpack import Webpack

webpack = Webpack()

def create_app():
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
