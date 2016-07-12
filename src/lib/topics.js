import fetch from 'isomorphic-fetch';

export function topicsList() {
  return fetch('/api/topics/list', {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicSummary(topicId) {
  return fetch(`/api/topics/${topicId}/summary`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicTopStories(topicId, snapshotId, timespanId, sort, limit, continuationId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  if (timespanId !== null) {
    params.timespan = timespanId;
  }
  if (sort !== null) {
    params.sort = sort;
  }
  if ((limit !== null) && (limit !== undefined)) {
    params.limit = limit;
  }
  if ((continuationId !== null) && (continuationId !== undefined)) {
    params.continuationId = continuationId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/stories?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicTopMedia(topicId, snapshotId, timespanId, sort, limit, continuationId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  if (timespanId !== null) {
    params.timespan = timespanId;
  }
  if (sort !== null) {
    params.sort = sort;
  }
  if ((limit !== null) && (limit !== undefined)) {
    params.limit = limit;
  }
  if ((continuationId !== null) && (continuationId !== undefined)) {
    params.continuationId = continuationId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/media?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicTopWords(topicId, snapshotId, timespanId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  if (timespanId !== null) {
    params.timespan = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/words?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicSnapshotsList(topicId) {
  return fetch(`/api/topics/${topicId}/snapshots/list`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicSnapshotTimespansList(topicId, snapshotId) {
  return fetch(`/api/topics/${topicId}/snapshots/${snapshotId}/timespans/list`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicSentenceCounts(topicId, snapshotId, timespanId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshot = snapshotId;
  }
  if (timespanId !== null) {
    params.timespan = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return fetch(`/api/topics/${topicId}/sentences/count?${paramStr}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function story(topicId, storiesId) {
  return fetch(`/api/topics/${topicId}/stories/${storiesId}`, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}
