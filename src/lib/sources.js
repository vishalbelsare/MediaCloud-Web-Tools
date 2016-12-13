import { createApiPromise, createPostingApiPromise, acceptParams } from './apiUtil';

export function sourceList() {
  return createApiPromise('api/sources/all');
}

export function sourcesByIds(params) {
  const acceptedParams = acceptParams(params, ['src']);
  acceptedParams['src[]'] = params;
  return createApiPromise('api/sources/list', acceptedParams);
}

export function sourceSearch(searchStr) {
  return createApiPromise(`/api/sources/search/${searchStr}`);
}

export function collectionList(id) {
  return createApiPromise(`api/collections/set/${id}`);
}

export function collectionsByIds(params) {
  const acceptedParams = acceptParams(params, ['coll']);
  acceptedParams['coll[]'] = params;
  return createApiPromise('api/collections/list', acceptedParams);
}

export function collectionSearch(searchStr) {
  return createApiPromise(`/api/collections/search/${searchStr}`);
}

export function sourceDetails(id) {
  return createApiPromise(`/api/sources/${id}/details`);
}

export function collectionDetails(id) {
  return createApiPromise(`/api/collections/${id}/details`);
}

export function sourceSentenceCount(id) {
  return createApiPromise(`api/sources/${id}/sentences/count`);
}

export function collectionSentenceCount(id) {
  return createApiPromise(`api/collections/${id}/sentences/count`);
}

export function sourceGeography(id) {
  return createApiPromise(`api/sources/${id}/geography`);
}

export function collectionGeography(id) {
  return createApiPromise(`api/collections/${id}/geography`);
}

export function sourceWordCount(id) {
  return createApiPromise(`api/sources/${id}/words`);
}

export function collectionWordCount(id) {
  return createApiPromise(`api/collections/${id}/words`);
}

export function collectionSourceStoryCounts(id) {
  return createApiPromise(`api/collections/${id}/sources/sentences/count`);
}

export function createCollection(params) {
  const acceptedParams = acceptParams(params, ['name', 'description', 'static']);
  acceptedParams['sources[]'] = params.sources.map(c => c.id);
  return createPostingApiPromise('/api/collections/create', acceptedParams);
}

export function updateCollection(params) {
  const acceptedParams = acceptParams(params, ['id', 'name', 'description', 'static']);
  acceptedParams['sources[]'] = params.sources.map(c => c.id);
  return createPostingApiPromise(`/api/collections/${acceptedParams.id}/update`, acceptedParams);
}

export function addSourceToCollection(params) {
  const acceptedParams = acceptParams(params, ['sourceObj']);
  return acceptedParams;
}

export function metadataValues(id) {
  return createApiPromise(`api/metadata/${id}/values`);
}

export function createSource(params) {
  const acceptedParams = acceptParams(params, ['name', 'url', 'notes', 'detectedLanguage']);
  acceptedParams['collections[]'] = params.collections.map(c => c.tags_id);
  return createPostingApiPromise('/api/sources/create', acceptedParams);
}

export function updateSource(params) {
  const acceptedParams = acceptParams(params, ['id', 'name', 'url', 'notes', 'detectedLanguage']);
  acceptedParams['collections[]'] = params.collections.map(c => c.tags_id);
  return createPostingApiPromise(`/api/sources/${acceptedParams.id}/update`, acceptedParams);
}

export function sourceFeeds(id) {
  return createApiPromise(`api/sources/${id}/feeds`);
}
