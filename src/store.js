import { createStore, applyMiddleware } from 'redux';
import hashHistory from 'react-router/lib/hashHistory';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';
import rootReducer from './reducers/root';

const reduxRouterMiddleware = routerMiddleware(hashHistory);

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  reduxRouterMiddleware,
  thunkMiddleware
)(createStore);

function configureStore() {
  return createStoreWithMiddleware(rootReducer,
        window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const store = configureStore();

export default store;
