import {createAction} from 'redux-actions';
import { browserHistory } from 'react-router'
import { promiseToLogin } from '../lib/auth'

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_FROM_EMAIL_AND_KEY = 'LOGIN_FROM_EMAIL_AND_KEY';

export const logout = createAction(LOGOUT, function(router){
  router.push("/login");
});

export const loginFromEmailAndKey = createAction(LOGIN_FROM_EMAIL_AND_KEY)

export function login(email,password) {
  return {
    type: LOGIN,
    payload: {
      promise: promiseToLogin(email,password),
      email
    }
  };
}
