import { APP_NAME } from '../config';
import { hasCookies } from '../lib/auth';

import sourceRoutes from './sourceRoutes';
import topicRoutes from './topicRoutes';


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

const routes = appRoutes;

export default routes;
