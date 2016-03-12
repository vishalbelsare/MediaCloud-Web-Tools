import {createAction} from 'redux-actions';
import fetch from 'isomorphic-fetch'

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const ATTEMPT_LOGIN = 'ATTEMPT_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// aktes one object arg - with the email property for the person trying to log in
export const requestLogin = createAction(REQUEST_LOGIN);
// takes one object arg - the results of the async attempt to log in
export const receiveLogin = createAction(RECEIVE_LOGIN);

// async fetcher!
export function attemptLogin(email, password){
  return dispatch => {
    console.log('attemptLogin');
    dispatch(requestLogin({email}));  // let the UI know we are trying to login
    return fetch(`/api/login`)
      .then(response => response.json())
      .then(json => dispatch(receiveLogin(json.data)) // let the app know how it turned out
    )
    // TODO: catch any network failures
  }
}

// takes one object arg - the user properties to store
export const login = createAction(LOGIN);

// no args
export const logout = createAction(LOGOUT);
