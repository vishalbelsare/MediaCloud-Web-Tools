MediaMeter BoilerPlate Web App
==============================

This is a boilerplate app combining a bunch of tech we will be using as the basis
for some of our new web apps.  Check out the `doc` folder for more documentation.

Installation
------------

Python 2.7:
 * [`virtualenv venv`](https://virtualenv.pypa.io/en/stable/)
 * `pip install -r requirements.txt`

NPM:
 * `npm install`

And install [MongoDb too](https://www.mongodb.com/dr/fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.2.6.tgz/download)

For better debugging, make sure to install:
 * [Redux DevTools Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
 * [React Developer Tools Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).

Configuration
------------- 

Copy `server.config.template` to `server.config` and fill in the required info there.

Developing
----------

Setup your environment with SublimeText and linting following [these instructions](https://medium.com/planet-arkency/catch-mistakes-before-you-run-you-javascript-code-6e524c36f0c8#.1mela5864).

You can run linting by hand too : `npm run lint`.

Running
-------

You need to open two terminal windows and run one thing in each (so the hot-reloading can work):
 * `npm start`
 * `python run.py`

Release
-------

TBD:
 * This doesn't have a dev vs. production setup yet.
 * Note to future self: try out `npm run-script build`
