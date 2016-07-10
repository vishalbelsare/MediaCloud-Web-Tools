import React from 'react';
import Route from 'react-router/lib/Route';
import { APP_NAME } from '../config';
import { hasCookies } from '../lib/auth';

import App from '../components/App';
import sourceRoutes from './sourceRoutes';
import topicRoutes from './topicRoutes';
import userRoutes from './userRoutes';


// We need to restrict some routes to only users that are logged in
export function requireAuth(nextState, replace) {
  if (!hasCookies()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

let appRoutes = null;
switch (APP_NAME) {
  case 'topics':
    appRoutes = topicRoutes;
    break;
  case 'sources':
    appRoutes = sourceRoutes;
    break;
  default:
    appRoutes = null;
}

const routes = (
  <Route path="/" component={App}>
    {userRoutes}
    {appRoutes}
  </Route>
);

export default routes;
