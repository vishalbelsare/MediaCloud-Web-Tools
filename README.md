MediaMeter BoilerPlate Web App
==============================

This is a boilerplate app combining a bunch of tech we will be using as the basis
for some of our new web apps.  Check out the `doc` folder for more documentation.

Dev Installation
----------------

Python 2.7:
 * python 2.7 https://www.python.org/download/releases/2.7/
 * `pip install virtualenv` (if necessary) [also install/link pip if you don't have it (if on Mac OS, use sudo easy_install pip)]
 * [`virtualenv venv`](https://virtualenv.pypa.io/en/stable/)
 *  `source venv/bin/activate` to activate your virtual environment (and not run any global python installations)
 * On OSX, make sure to run `brew install libmemcached` otherwise you'll get an error about pylibmc failing to install (http://brew.sh)
 * in MediaMeter directory>`pip install -r requirements.txt` 

Node and npm:  
 * make sure your node installation is up-to-date (we work with v5.9.0 right now)
 * `npm install` to install all the package dependencies (as specified in the `package.json`)

MongoDB:
[Install MongoDb](https://docs.mongodb.com/manual/installation/).  We develop on OS X and install via the [HomeBrew package manager](http://brew.sh): `brew install mongodb`

Configuration
------------- 

Copy `config/server.config.template` to `config/server.config` and fill in the required info there.

Developing
----------

You will make your life easier by installing these tools to help you develop better:
 * [Redux DevTools Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
 * [React Developer Tools Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
 * Set up your environment with [SublimeText](https://www.sublimetext.com) and linting following [these instructions](https://medium.com/planet-arkency/catch-mistakes-before-you-run-you-javascript-code-6e524c36f0c8#.1mela5864).
 * - Essentially, you need to tell Sublime to install the Sublime package control manager and then you need to install the necessary packages using Sublime's command line. That's all there in the link, just make sure you follow the prompts explicity.
 * To browse your local DB on a Mac use [MongoHub](https://github.com/bububa/MongoHub-Mac), or [MongoExpress for a web-based UI](https://github.com/mongo-express/mongo-express)

Running
-------

You need to open two terminal windows and run one thing in each (so the hot-reloading can work):
 * `npm run topics-dev` or `npm run sources-dev`
 * `python run.py`
    - if you get flask errors, run the `pip install -r requirements.txt` line again. On Mac Osx, you may need to run with --ignore-installed

Releasing
---------

1. Update the version number in `src/config.js`.
2. Change the server mode in `config/server.config` to `PROD`.
3. Change the app you want to build in `config/server.config` (set the server/app variable).
4. Build the release version of the JS and CSS: `npm run topics-release` or `npm run sources-release`.
5. Test it and then tag and commit it all.

Updating npm Depedencies
------------------------

It is important to occasionally we upgrade to the latest verison of the npm libraries we use.
This is something to do every month or so, to make sure we don't fall behind the rapid development 
in this libraries.  

To do this:
1) First make sure you have npm-check-updates installed: `npm install -g npm-check-updates`.
2) Update the dependencies in our `package.json`, run `npm-check-updates -u`.
3) Do a regular `npm install` to test them all out.
4) Run the code and fix any errors.
4) Check in the updated `package.json`.
