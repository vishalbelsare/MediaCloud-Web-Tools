import fetch from 'isomorphic-fetch';

export function promiseToFetchControversyList() {
  return fetch('/api/controversy/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function promiseToFetchControversySummary(id) {
  return fetch(`/api/controversy/${id}/summary`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}
