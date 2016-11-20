import cookie from 'react-cookie';
import { createPostingApiPromise } from './apiUtil';

export const PERMISSION_TOPIC_NONE = 'none';
export const PERMISSION_TOPIC_READ = 'read';
export const PERMISSION_TOPIC_WRITE = 'write';
export const PERMISSION_TOPIC_ADMIN = 'admin';

const COOKIE_USERNAME = 'mediameter_user_username';
const COOKIE_KEY = 'mediameter_user_key';

export function promiseToLoginWithPassword(email, password) {
  const params = { email, password };
  return createPostingApiPromise('/api/login', params);
}

export function promiseToLoginWithKey(email, key) {
  const params = { email, key };
  return createPostingApiPromise('/api/login-with-key', params);
}

export function saveCookies(email, key) {
  cookie.save(COOKIE_USERNAME, email);
  cookie.save(COOKIE_KEY, key);
}

export function deleteCookies() {
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
