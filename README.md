MediaMeter BoilerPlate Web App
==============================

This is a boilerplate app combining a bunch of tech we will be using as the basis
for some of our new web apps.  Check out the `doc` folder for more documentation.

Dev Installation
----------------

Python 2.7:
 * [`virtualenv venv`](https://virtualenv.pypa.io/en/stable/)
 *  `source venv/bin/activate` to activate your virtual environment (and not run any global python installations)
 * `pip install -r requirements.txt`

Node and npm:  
 * make sure your node installation is up-to-date (we work with v5.9.0 right now)
 * `npm install` to install all the package dependencies (as specified in the `package.json`)

MongoDB:
[Install MongoDb](https://docs.mongodb.com/manual/installation/).  We develop on OS X and install via the [HomeBrew package manager](http://brew.sh): `brew install mongodb`
 
Configuration
------------- 

Copy `server.config.template` to `server.config` and fill in the required info there (your MediaCloud API key).

Developing
----------

You will make your life easier by installing these tools to help you develop better:
 * [Redux DevTools Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
 * [React Developer Tools Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
 * Setup your environment with [SublimeText](https://www.sublimetext.com) and linting following [these instructions](https://medium.com/planet-arkency/catch-mistakes-before-you-run-you-javascript-code-6e524c36f0c8#.1mela5864).
 * To browse your local DB on a Mac use [MongoHub](https://github.com/bububa/MongoHub-Mac), or [MongoExpress for a web-based UI](https://github.com/mongo-express/mongo-express)

Running
-------

You need to open two terminal windows and run one thing in each (so the hot-reloading can work):
 * `npm start`
 * `python run.py`

Releasing
---------

1. Update the version numbers (location TBD).
2. Run the linting by hand to make sure you don't have any code errors: `npm run lint`.
3. Build the release version of the JS and CSS: `npm run release`.
