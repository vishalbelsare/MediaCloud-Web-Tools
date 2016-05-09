import cookie from 'react-cookie';
import fetch from 'isomorphic-fetch';

const COOKIE_USERNAME = 'mediameter_user_username';
const COOKIE_KEY = 'mediameter_user_key';

export function promiseToLoginWithPassword(email, password) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  return fetch('/api/login', {
    method: 'post',
    body: formData,
  }).then(
    response => response.json()
  );
}

export function promiseToLoginWithKey(email, key) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('key', key);
  return fetch('/api/login-with-key', {
    method: 'post',
    body: formData,
  }).then(
    response => response.json()
  );
}

export function saveCookies(email, key) {
  cookie.save(COOKIE_USERNAME, email);
  cookie.save(COOKIE_KEY, key);
}

export function deleteCookies() {
  console.log("remove cookies!");
  cookie.remove(COOKIE_USERNAME);
  cookie.remove(COOKIE_KEY);
}

export function hasCookies() {
  return (cookie.load(COOKIE_KEY) !== undefined) && (cookie.load(COOKIE_USERNAME) !== undefined);
}

export function getCookies() {
  return {
    email: cookie.load(COOKIE_USERNAME),
    key: cookie.load(COOKIE_KEY),
  };
}
