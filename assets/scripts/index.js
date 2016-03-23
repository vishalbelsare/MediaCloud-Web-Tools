import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { hasCookies, getCookies } from './lib/auth';
import { loginWithKey, logout } from './user/userActions';

import App from './app/App';
import Home from './user/Home';
import About from './app/About';
import Login from './user/Login';
import ControversyList from './controversy/ControversyList';
import configureStore from './store/configureStore';

// necessary lines for Material-UI library to work
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// Add the reducer to your store on the `routing` key
const store = configureStore();

// load any cookies correctly
if (hasCookies()) {
  const cookies = getCookies();
  store.dispatch(loginWithKey(cookies.email, cookies.key));
}

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store);

//TODO: history.listen(location => analyticsService.track(location.pathname))

function requireAuth(nextState, replace) {
  if (!hasCookies()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

// CB that fires on Logout click to lot you out immediately
function onEnterLogout(nextState, replaceState) {
  store.dispatch(logout());
  replaceState('/login');
}

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale='en'>
      <Router history={history}>
        <Route path='/' component={App}>
          <Route path='/home' component={Home} onEnter={requireAuth} />
          <Route path='/controversies' component={ControversyList} onEnter={requireAuth} />
          <Route path='/about' component={About} />
          <Route path='/login' component={Login} />
          <Route path='/logout' onEnter={onEnterLogout} />
        </Route>
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('app')
);
