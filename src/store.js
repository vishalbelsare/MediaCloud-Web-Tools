import { createStore, applyMiddleware } from 'redux';
import hashHistory from 'react-router/lib/hashHistory';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';
import rootReducer from './reducers/root';
import { APP_MODE } from './config.js';

const reduxRouterMiddleware = routerMiddleware(hashHistory);

const middlewares = [
  promiseMiddleware(),
  reduxRouterMiddleware,
  thunkMiddleware,
];

// only log actions in dev mode
if (APP_MODE === 'dev') {
  const createLogger = require('redux-logger');
  const logger = createLogger();
  middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

function configureStore() {
  return createStoreWithMiddleware(rootReducer,
        window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const store = configureStore();

export default store;
