import 'babel-polyfill';
import 'intl';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import hashHistory from 'react-router/lib/hashHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { hasCookies } from './lib/auth';
import { loginWithCookie } from './actions/userActions';
import store from './store';
import { getBrandColors } from './styles/colors';

const APP_DOM_ELEMENT_ID = 'app';
const DEFAULT_LOCALE = 'en';

/**
 * Call this from your own appIndex.js with some routes to start up your app.  Do not
 * refer to this file as an entry point directly.
 */
export default function initializeApp(routes) {
  // necessary lines for Material-UI library to work
  injectTapEventPlugin();

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(hashHistory, store);

  const logPageView = () => {
    // only log hits to google analytics when in production mode
    if (process.env.NODE_ENV === 'production') {
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname);
    }
  };

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
          <IntlProvider locale={DEFAULT_LOCALE}>
            <Router history={history} onUpdate={logPageView}>
              {routes}
            </Router>
          </IntlProvider>
        </Provider>
      </MuiThemeProvider>,
      document.getElementById(APP_DOM_ELEMENT_ID)
    );
  };

  // log them in if they have a valid cookie
  if (hasCookies()) {
    store.dispatch(loginWithCookie())
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
