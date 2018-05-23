import 'babel-polyfill';
import 'intl';
import 'core-js/es6/map';
import 'core-js/es6/set';
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
import { loginWithCookie } from './actions/userActions';
import getStore from './store';
import { getAppName } from './config';
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

  const store = getStore(getAppName());

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
    zIndex: {
      menu: 10001,
      dialogOverlay: 9999,
      dialog: 10000,
      layer: 10001,
      popover: 10001,
    },
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

  // log them in if they have a valid cookie (wait till login attempt complete before rendering app)
  store.dispatch(loginWithCookie())
    .then(() => renderApp());
}
