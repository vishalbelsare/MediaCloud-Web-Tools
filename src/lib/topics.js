import fetch from 'isomorphic-fetch';

/**
 * Helper to stich together any defined params into a string suitable for url arg submission
 */
function generateParamStr(params) {
  const cleanedParams = {};
  for (const key in params) {
    const value = params[key];
    if ((value !== null) && (value !== undefined)) {
      cleanedParams[key] = value;
    }
  }
  const paramStr = Object.keys(cleanedParams).map((key) => `${key}=${encodeURIComponent(cleanedParams[key])}`).join('&');
  return paramStr;
}

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
  if ((snapshotId !== null) && (snapshotId !== undefined)) {
    params.snapshotId = snapshotId;
  }
  if ((timespanId !== null) && (timespanId !== undefined)) {
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
  if ((timespanId !== null) && (timespanId !== undefined)) {
    params.timespanId = timespanId;
  }
  const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/outlinks?${paramStr}`);
}

export function media(topicId, mediaId) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}`);
}

export function mediaSentenceCounts(topicId, mediaId, snapshotId, timespanId) {
  const paramStr = generateParamStr({ snapshotId, timespanId });
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/sentences/count?${paramStr}`);
}

export function mediaStories(topicId, mediaId, snapshotId, timespanId, sort, limit) {
  const paramStr = generateParamStr({ snapshotId, timespanId, sort, limit });
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/stories?${paramStr}`);
}

export function mediaInlinks(topicId, mediaId, snapshotId, timespanId, sort, limit) {
  const paramStr = generateParamStr({ snapshotId, timespanId, sort, limit });
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/inlinks?${paramStr}`);
}

export function mediaOutlinks(topicId, mediaId, snapshotId, timespanId, sort, limit) {
  const paramStr = generateParamStr({ snapshotId, timespanId, sort, limit });
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/outlinks?${paramStr}`);
}

export function mediaWords(topicId, mediaId, snapshotId, timespanId) {
  const paramStr = generateParamStr({ snapshotId, timespanId });
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/words?${paramStr}`);
}
