import {createAction} from 'redux-actions';
import fetch from 'isomorphic-fetch'

export const LOGIN = 'LOGIN';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT = 'LOGOUT';

export const loginPending = createAction(LOGIN_PENDING);
export const loginSucceeded = createAction(LOGIN_SUCCEEDED);
export const loginFailed = createAction(LOGIN_FAILED);
export const logout = createAction(LOGOUT);

export default function login(email, password){
  return dispatch => {
    dispatch(loginPending({'email':email}));
    return fetch("/api/login")
      .then(response => response.json())
      .then(json => dispatch(loginSucceeded(json.data)) // let the app know how it turned out
    );
  };
}