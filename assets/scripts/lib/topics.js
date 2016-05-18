import fetch from 'isomorphic-fetch';

export function topicsList() {
  return fetch('/api/topics/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicSummary(id) {
  return fetch(`/api/topics/${id}/summary`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicTopStories(topicId, snapshotId, sort) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  if (sort !== null) {
    params.sort = sort;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/top-stories?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicTopMedia(topicId, snapshotId, sort) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  if (sort !== null) {
    params.sort = sort;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/top-media?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicTopWords(topicId, snapshotId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/top-words?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicSnapshotsList(id) {
  return fetch(`/api/topics/${id}/snapshots/list`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}
