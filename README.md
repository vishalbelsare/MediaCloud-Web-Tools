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

Configuration
-------------

Copy `server.config.template` to `server.config` and fill in the required info there.

Running
-------

You need to open two terminal windows and run one thing in each (so the hot-reloading can work):
 * `npm start`
 * `python run.py`

Release
-------

Note to future self: `npm run-script build`
