import fetch from 'isomorphic-fetch';

export function controversiesList() {
  return fetch('/api/topics/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function controversySummary(id) {
  return fetch(`/api/topics/${id}/summary`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function controversyTopStories(topicId, snapshotId, sort) {
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

export function controversyTopMedia(topicId, snapshotId, sort) {
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

export function controversyTopWords(topicId, snapshotId) {
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
