import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './app/App';
import About from './app/About';
import Login from './user/Login';
import Logout from './user/Logout';
import configureStore from './store/configureStore';

// necessary lines for Material-UI library to work
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// Add the reducer to your store on the `routing` key
const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="about" component={About}/>
        <Route path="login" component={Login}/>
        <Route path="logout" component={Logout}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
