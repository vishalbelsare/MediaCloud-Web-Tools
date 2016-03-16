import {createAction} from 'redux-actions';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const logout = createAction(LOGOUT);

function promiseToLogin(email,password){
  let formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return fetch("/api/login", {
    method: 'post',
    body: formData
  }).then(
    response => response.json()
  );
}

export default function login(email,password) {
  return {
    type: LOGIN,
    payload: {
      promise: promiseToLogin(email,password),
      email
    }
  };
}
