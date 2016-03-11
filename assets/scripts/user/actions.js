
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const LOGGED_OUT_USER_STATE = { 'isLoggedIn': false };

export function login(user) {
  return {
    type: LOGIN,
    user
  };
}

export function logout() {
  return {
    type: LOGOUT,
    user: LOGGED_OUT_USER_STATE
  };
}
