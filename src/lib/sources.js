import { createApiPromise, createPostingApiPromise, acceptParams } from './apiUtil';

export function sourceList() {
  return createApiPromise('api/sources/list');
}

export function sourceSearch(searchStr) {
  return createApiPromise(`/api/sources/${searchStr}/search`);
}

export function collectionList() {
  return createApiPromise('api/collections/all');
}

export function collectionSearch(searchStr) {
  return createApiPromise(`/api/collections/${searchStr}/search`);
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
  const acceptedParams = acceptParams(params, ['collectionName', 'collectionDescription', 'static', 'sourceObj']);
  return createPostingApiPromise('/api/collections/create', acceptedParams);
}

export function addSourceToCollection(params) {
  const acceptedParams = acceptParams(params, ['sourceObj']);
  return acceptedParams;
}

export function sourceMetadata() {
  return createApiPromise('api/sources/metadata');
}

export function countryList() {
  return createApiPromise('api/sources/countrylist');
}
