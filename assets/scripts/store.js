import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';
import rootReducer from './reducers/root';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  thunkMiddleware
)(createStore);

function configureStore() {
  return createStoreWithMiddleware(rootReducer,
        window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

const store = configureStore();

export default store;
