import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import cookie from 'react-cookie';
import { hasCookies, getCookies } from './lib/auth'
import { loginFromEmailAndKey } from './user/userActions'

import App from './app/App';
import Home from './user/Home';
import About from './app/About';
import Login from './user/Login';
import Logout from './user/Logout';
import configureStore from './store/configureStore';

// necessary lines for Material-UI library to work
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// Add the reducer to your store on the `routing` key
const store = configureStore();
console.log(store.getState());

// load any cookies correctly
if(hasCookies()){
  store.dispatch(loginFromEmailAndKey(getCookies()));
}

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store);

//TODO: history.listen(location => analyticsService.track(location.pathname))

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="/home" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/login" component={Login}/>
        <Route path="/logout" component={Logout}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
