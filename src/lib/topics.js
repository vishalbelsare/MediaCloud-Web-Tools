import fetch from 'isomorphic-fetch';

/**
 * Helper to stich together any defined params into a string suitable for url arg submission
 */
function generateParamStr(params) {
  const cleanedParams = {};
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      if ((value !== null) && (value !== undefined)) {
        cleanedParams[key] = value;
      }
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
function createApiPromise(url, params) {
  let fullUrl = url;
  if (params !== undefined) {
    fullUrl = `${url}?${generateParamStr(params)}`;
  }
  return fetch(fullUrl, {
    method: 'get',
    credentials: 'include',
  }).then(
    response => response.json()
  );
}

/**
 * Helper to create a promise that calls the API on the server with some POST'd data. Pass in the endpoint url,
 * and a data object to encode and POST, and this will return a promise to call it with the appropriate headers
 * and such.  It also parses the json response for you.
 */

function createPostingApiPromise(url, params) {
  const formData = new FormData();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  }
  return fetch(url, {
    method: 'post',
    credentials: 'include',
    body: formData,
  }).then(
    response => response.json()
  );
}

export const topicsList = (linkId) => createApiPromise('/api/topics/list', { linkId });

export function topicSummary(topicId) {
  return createApiPromise(`/api/topics/${topicId}/summary`);
}

export const topicTopStories = (topicId, params) => createApiPromise(`/api/topics/${topicId}/stories`, params);

export const topicTopMedia = (topicId, params) => createApiPromise(`/api/topics/${topicId}/media`, params);

export const topicTopWords = (topicId, params) => createApiPromise(`/api/topics/${topicId}/words`, params);

export const topicSnapshotsList = (topicId) => createApiPromise(`/api/topics/${topicId}/snapshots/list`);

export const topicTimespansList = (topicId, snapshotId) => createApiPromise(`/api/topics/${topicId}/snapshots/${snapshotId}/timespans/list`);

export const topicSentenceCounts = (topicId, params) => createApiPromise(`/api/topics/${topicId}/sentences/count`, params);

export const story = (topicId, storiesId) => createApiPromise(`/api/topics/${topicId}/stories/${storiesId}`);

export const storyWords = (topicId, storiesId) => createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/words`);

export function storyInlinks(topicId, storiesId, params) {
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/inlinks`, params);
}

export function storyOutlinks(topicId, storiesId, params) {
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/outlinks`, params);
}

export function media(topicId, mediaId) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}`);
}

export function mediaSentenceCounts(topicId, mediaId, params) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/sentences/count`, params);
}

export function mediaStories(topicId, mediaId, params) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/stories`, params);
}

export function mediaInlinks(topicId, mediaId, params) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/inlinks`, params);
}

export function mediaOutlinks(topicId, mediaId, params) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/outlinks`, params);
}

export function mediaWords(topicId, mediaId, params) {
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/words`, params);
}

export function topicFocalSetsList(topicId, snapshotId) {
  const paramStr = generateParamStr({ snapshotId });
  return createApiPromise(`/api/topics/${topicId}/focal-sets/list?${paramStr}`);
}

export function createFocalSetDefinition(topicId, params) {
  return createPostingApiPromise(`api/topics/${topicId}/focal-set-definitions/create`, params);
}

export function listFocalSetDefinitions(topicId) {
  return createApiPromise(`api/topics/${topicId}/focal-set-definitions`);
}

export function createFocusDefinition(topicId, params) {
  return createApiPromise(`/api/topics/${topicId}/focus-definitions/create`, params);
}
