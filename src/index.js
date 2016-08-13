import 'babel-polyfill';
import 'intl';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import hashHistory from 'react-router/lib/hashHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { hasCookies, getCookies } from './lib/auth';
import { loginWithKey } from './actions/userActions';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import routes from './routes/routes.js';
import store from './store';
import { APP_NAME } from './config';
import { filterBySnapshot, filterByTimespan, filterByFocus } from './actions/topicActions';

// necessary lines for Material-UI library to work
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store);

// Grab any filters on the url and put them in the right place in the store
switch (APP_NAME) {
  case 'topics':
    // check if url has any params we care about
    const hash = window.location.hash;
    const hashParts = hash.split('?');
    const args = {};
    const queryParts = hashParts[1].split('&');
    for (const i in queryParts) {
      const argParts = queryParts[i].split('=');
      args[argParts[0]] = argParts[1];
    }
    if ('snapshotId' in args) {
      store.dispatch(filterBySnapshot(args.snapshotId));
    }
    if ('timespanId' in args) {
      store.dispatch(filterByTimespan(args.timespanId));
    }
    if ('focusId' in args) {
      store.dispatch(filterByFocus(args.focusId));
    }
    break;
  case 'sources':
    break;
  default:
    break;
}
// TODO: history.listen(location => analyticsService.track(location.pathname))

const renderApp = () => {
  ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Provider store={store}>
        <IntlProvider locale="en">
            <Router history={history}>
              {routes}
            </Router>
        </IntlProvider>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('app')
  );
};

// load any cookies correctly
if (hasCookies()) {
  const cookies = getCookies();
  store.dispatch(loginWithKey(cookies.email, cookies.key))
    .then((results) => {
      if (results.hasOwnProperty('status') && (results.status !== 200)) {
        if (window.location.href.indexOf('login') === -1) {
          window.location = '/#/login';
        }
      }
      renderApp();
    });
} else {
  renderApp();
}
