import fetch from 'isomorphic-fetch';

export function promiseToListControversies() {
  return fetch('/api/controversy-list', {
    method: 'get',
    credentials: 'same-origin'
  }).then(
    response => response.json()
  );
}
