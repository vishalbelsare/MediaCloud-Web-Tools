
export const COOKIE_USERNAME = 'mediameter_user_username';
export const COOKIE_KEY = 'mediameter_user_key';

export function promiseToLogin(email,password){
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
