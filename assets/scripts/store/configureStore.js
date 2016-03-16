import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

import {reducer as form} from 'redux-form';
import app from '../app/appReducers';
import user from '../user/userReducers';

const rootReducer = combineReducers({
  app,
  user,
  form,
  routing
});
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

export default function configureStore(initialState = {}) {
  return createStoreWithMiddleware(rootReducer,
        window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}

/*
export default function configureStore(initialState = {}) {
  return createStore(
    combineReducers({
      app,
      user,
      form,
      routing
    }),
    applyMiddleware(
      thunkMiddleware  // lets us use dispatch() functions with async actions
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}*/