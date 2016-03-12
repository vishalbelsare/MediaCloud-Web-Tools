import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';

import {reducer as form} from 'redux-form';
import app from '../app/appReducers'
import user from '../user/userReducers'

const loggerMiddleware = createLogger()

export default function configureStore(initialState = {}) {
  return createStore(
    combineReducers({
      app,
      user,
      form,
      routing
    }),
    applyMiddleware(
      thunkMiddleware,  // lets us use dispatch() functions with async actions
      loggerMiddleware  // automatically log actions to the console
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
}