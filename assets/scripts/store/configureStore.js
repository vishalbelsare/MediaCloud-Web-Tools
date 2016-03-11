import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';

import {reducer as form} from 'redux-form';
import app from '../app/reducers'
import user from '../user/reducers'

const loggerMiddleware = createLogger()

export default function configureStore(initialState = {}) {
  return createStore(
    combineReducers({
      app,
      user,
      form,
      routing: routerReducer
    }),
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
}