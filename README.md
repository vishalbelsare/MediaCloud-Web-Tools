MediaMeter BoilerPlate Web App
==============================

This is a boilerplate app combining a bunch of tech we will be using as the basis
for some of our new web apps.

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

Running
-------

You need to open two terminal windows and run one thing in each (so the hot-reloading can work):
 * `npm start`
 * `python run.py`

To check your javascript code for errors run: `npm run-script lint`

Release
-------

TBD:
 * This doesn't have a dev vs. production setup yet.
 * Note to future self: try out `npm run-script build`
