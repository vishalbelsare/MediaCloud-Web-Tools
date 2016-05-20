MediaMeter BoilerPlate Web App
==============================

This is a boilerplate app combining a bunch of tech we will be using as the basis
for some of our new web apps.  Check out the `doc` folder for more documentation.

Installation
------------

Python 2.7:
 * `virtualenv venv`
 * `pip install -r requirements.txt`

NPM:
 * `npm install`

And install MongoDb too.

For better debugging, make sure to install the [Redux DevTools Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd.

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
