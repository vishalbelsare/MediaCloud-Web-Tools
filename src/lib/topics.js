import fetch from 'isomorphic-fetch';

/**
 * Helper to create a promise that calls the API on the server. Pass in the endpoint url, with params
 * encoded on it already, and this will return a promise to call it with the appropriate headers and
 * such.  It also parses the json response for you.
 */
function createApiPromise(url) {
  return fetch(url, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

export function topicsList(linkId) {
  const params = {};
  if ((linkId !== null) && (linkId !== undefined)) {
    params.linkId = linkId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/list?${paramStr}`);
}

export function topicSummary(topicId) {
  return createApiPromise(`/api/topics/${topicId}/summary`);
}

export function topicTopStories(topicId, snapshotId, timespanId, sort, limit, linkId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshotId = snapshotId;
  }
  if (timespanId !== null) {
    params.timespanId = timespanId;
  }
  if (sort !== null) {
    params.sort = sort;
  }
  if ((limit !== null) && (limit !== undefined)) {
    params.limit = limit;
  }
  if ((linkId !== null) && (linkId !== undefined)) {
    params.linkId = linkId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/stories?${paramStr}`);
}

export function topicTopMedia(topicId, snapshotId, timespanId, sort, limit, linkId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshotId = snapshotId;
  }
  if (timespanId !== null) {
    params.timespanId = timespanId;
  }
  if (sort !== null) {
    params.sort = sort;
  }
  if ((limit !== null) && (limit !== undefined)) {
    params.limit = limit;
  }
  if ((linkId !== null) && (linkId !== undefined)) {
    params.linkId = linkId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/media?${paramStr}`);
}

export function topicTopWords(topicId, snapshotId, timespanId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshotId = snapshotId;
  }
  if (timespanId !== null) {
    params.timespanId = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/words?${paramStr}`);
}

export function topicSnapshotsList(topicId) {
  return createApiPromise(`/api/topics/${topicId}/snapshots/list`);
}

export function topicTimespansList(topicId, snapshotId) {
  return createApiPromise(`/api/topics/${topicId}/snapshots/${snapshotId}/timespans/list`);
}

export function topicSentenceCounts(topicId, snapshotId, timespanId) {
  const params = {};
  if (snapshotId !== null) {
    params.snapshotId = snapshotId;
  }
  if (timespanId !== null) {
    params.timespanId = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/sentences/count?${paramStr}`);
}

export function story(topicId, storiesId) {
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}`);
}

export function storyWords(topicId, storiesId) {
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/words`);
}

export function storyInlinks(topicId, timespanId, storiesId) {
  const params = {};
  if ((timespanId !== null) && (timespanId !== undefined)) {
    params.timespanId = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/inlinks?${paramStr}`);
}

export function storyOutlinks(topicId, timespanId, storiesId) {
  const params = {};
  if (timespanId !== null) {
    params.timespanId = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/outlinks?${paramStr}`);
}

export function media(topicId, mediaId) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}`);
}
