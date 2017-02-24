import hashHistory from 'react-router/lib/hashHistory';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';
import { createStore, applyMiddleware, compose } from 'redux';
import { errorReportingMiddleware } from './lib/reduxHelpers';
import rootReducer from './reducers/root';

const reduxRouterMiddleware = routerMiddleware(hashHistory);

const middlewares = [
  promiseMiddleware(),
  reduxRouterMiddleware,
  thunkMiddleware,
  errorReportingMiddleware,
];

function configDevelopmentStore() {
  return createStore(rootReducer, {}, compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));
}

function configProductionStore() {
  return createStore(rootReducer, {}, compose(
    applyMiddleware(...middlewares),
  ));
}

const store = (process.env.NODE_ENV === 'production') ? configProductionStore() : configDevelopmentStore();

export default store;
