import { createApiPromise, createPostingApiPromise } from './apiUtil';

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
  return createApiPromise(`/api/topics/${topicId}/focal-sets/list`, { snapshotId });
}

export function createFocalSetDefinition(topicId, params) {
  return createPostingApiPromise(`api/topics/${topicId}/focal-set-definitions/create`, params);
}

export function listFocalSetDefinitions(topicId) {
  return createApiPromise(`api/topics/${topicId}/focal-set-definitions/list`);
}

export function createFocusDefinition(topicId, params) {
  return createApiPromise(`/api/topics/${topicId}/focus-definitions/create`, params);
}
