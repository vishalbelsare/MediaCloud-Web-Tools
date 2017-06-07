import { createApiPromise, createPostingApiPromise } from '../apiUtil';

export function loginWithPassword(email, password) {
  const params = { email, password };
  return createPostingApiPromise('/api/login', params);
}

export function loginWithCookie() {
  return createApiPromise('/api/login-with-cookie');
}
