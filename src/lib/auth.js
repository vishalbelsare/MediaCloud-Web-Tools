import cookie from 'react-cookie';
import { createPostingApiPromise, acceptParams } from './apiUtil';

export const PERMISSION_TOPIC_NONE = 'none';
export const PERMISSION_TOPIC_READ = 'read';
export const PERMISSION_TOPIC_WRITE = 'write';
export const PERMISSION_TOPIC_ADMIN = 'admin';


export const PERMISSION_LOGGED_IN = 'user';
// can do anything
export const PERMISSION_ADMIN = 'admin';
// can add and remove tags from media
export const PERMISSION_MEDIA_EDIT = 'media-edit';
// can add and remove tags from stories
export const PERMISSION_STORY_EDIT = 'story-edit';

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

export function changePassword(params) {
  const acceptedParams = acceptParams(params, ['old_password', 'new_password']);
  return createPostingApiPromise('/api/user/change_password', acceptedParams);
}

export function recoverPassword(email) {
  return createPostingApiPromise('/api/user/recover_password', email);
}

export function signupUser(params) {
  const acceptedParams = acceptParams(params, ['email', 'password', 'fullName', 'notes', 'subscribeToNewsletter']);
  return createPostingApiPromise('/api/user/signup', acceptedParams);
}

export function resendActionationEmail(email) {
  return createPostingApiPromise('/api/user/activation/resend', email);
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
