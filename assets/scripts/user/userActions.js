import {createAction} from 'redux-actions';
import { browserHistory } from 'react-router'
import { promiseToLoginWithPassword, promiseToLoginWithKey } from '../lib/auth'

export const LOGIN_WITH_PASSWORD = 'LOGIN_WITH_PASSWORD';
export const LOGIN_WITH_KEY = 'LOGIN_FROM_KEY';
export const LOGOUT = 'LOGOUT';

export const logout = createAction(LOGOUT, function(router){
  router.push("/login");
});

export function loginWithKey(email,key) {
  return {
    type: LOGIN_WITH_KEY,
    payload: {
      promise: promiseToLoginWithKey(email,key),
      email
    }
  };
}

export function loginWithPassword(email,password,destination) {
  return {
    type: LOGIN_WITH_PASSWORD,
    payload: {
      promise: promiseToLoginWithPassword(email,password),
      email,
      destination
    }
  };
}

