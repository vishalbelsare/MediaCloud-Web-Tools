import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import App from './app/App'
import About from './app/About'
import leftNavVisibility from './app/reducers'

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// Add the reducer to your store on the `routing` key
const logger = createLogger();
const store = createStore(
  combineReducers({
    leftNavVisibility,
    routing: routerReducer
  }),
  applyMiddleware(thunk, logger)
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="about" component={About}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
