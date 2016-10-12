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

const store = createStore(rootReducer, {}, compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

/*
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

function configureStore() {
  return createStoreWithMiddleware(rootReducer,
        window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const store = configureStore();
*/
export default store;
