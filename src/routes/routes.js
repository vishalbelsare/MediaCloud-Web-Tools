import { hasCookies } from '../lib/auth';

// We need to restrict some routes to only users that are logged in
export function requireAuth(nextState, replace) {
  if (!hasCookies()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

export function redirectHomeIfLoggedIn(nextState, replace) {
  if (hasCookies()) {
    replace({
      pathname: '/home',
      state: { nextPathname: nextState.location.pathname },
    });
    return true;
  }
  return false;
}
