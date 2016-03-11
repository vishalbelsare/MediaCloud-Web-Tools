import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';

import leftNavVisibility from '../app/reducers'
import user from '../user/reducers'

const loggerMiddleware = createLogger()

export default function configureStore(initialState = {}) {
  return createStore(
    combineReducers({
      leftNavVisibility,
      user,
      routing: routerReducer
    }),
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
}