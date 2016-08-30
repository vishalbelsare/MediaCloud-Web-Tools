import { hasCookies } from '../lib/auth';

// We need to restrict some routes to only users that are logged in
export function requireAuth(nextState, replace) {  // eslint-disable-line import/prefer-default-export
  if (!hasCookies()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}
