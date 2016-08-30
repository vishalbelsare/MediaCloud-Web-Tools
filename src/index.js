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
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { hasCookies, getCookies } from './lib/auth';
import { loginWithKey } from './actions/userActions';
import store from './store';
import { getBrandColors } from './styles/colors';


export default function initializeApp(routes) {
  // necessary lines for Material-UI library to work
  injectTapEventPlugin();

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(hashHistory, store);

  // TODO: history.listen(location => analyticsService.track(location.pathname))

  const muiTheme = getMuiTheme({
    fontFamily: 'Lato, sans',
    palette: {
      primary1Color: getBrandColors().dark,
      accent1Color: getBrandColors().light,
    },
  });

  const renderApp = () => {
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
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
        if ({}.hasOwnProperty.call(results, 'status') && (results.status !== 200)) {
          if (window.location.href.indexOf('login') === -1) {
            window.location = '/#/login';
          }
        }
        renderApp();
      });
  } else {
    renderApp();
  }
}
