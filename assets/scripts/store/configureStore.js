import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';

import { reducer as form } from 'redux-form';
import app from '../app/appReducers';
import user from '../user/userReducers';
import controversies from '../controversy/controversyReducers';

const rootReducer = combineReducers({
  app,
  user,
  controversies,
  form,
  routing
});
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
  thunkMiddleware
)(createStore);

export default function configureStore() {
  return createStoreWithMiddleware(rootReducer,
        window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}
