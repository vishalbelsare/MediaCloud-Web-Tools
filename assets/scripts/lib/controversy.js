import fetch from 'isomorphic-fetch';

export function controversiesList() {
  return fetch('/api/controversy/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function controversySummary(id) {
  return fetch(`/api/controversy/${id}/summary`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function controversyTopStories(id, sort) {
  return fetch(`/api/controversy/${id}/top-stories`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}
