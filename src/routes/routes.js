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
    replace({ pathname: '/home' });
    return true;
  }
  return false;
}

export function requiresUrlParams(...params) {
  return (nextState, replaceState) => {
    for (let i = 0; i < params.length; i += 1) {
      if (nextState.location.query[params[i]] === undefined) {
        replaceState('/home');
        return;
      }
    }
  };
}
