import { createPostingApiPromise } from '../apiUtil';

export function loginWithPassword(email, password) {
  const params = { email, password };
  return createPostingApiPromise('/api/login', params);
}

export function loginWithKey(email, key) {
  const params = { email, key };
  return createPostingApiPromise('/api/login-with-key', params);
}
