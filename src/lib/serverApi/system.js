import { createApiPromise, acceptParams } from '../apiUtil';

export function systemStats() {
  return createApiPromise('/api/system-stats');
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error


export function fetchMediaPickerFeaturedCollections() {
  // TODO fetch sources too, for now just temp using collections
  return createApiPromise('/api/mediapicker/collections/featured');
}
export function fetchMediaPickerCollections(params) {
  const acceptedParams = acceptParams(params, ['media_keyword', 'which_set']);
  return createApiPromise('/api/mediapicker/collections/search', acceptedParams);
}

export function fetchMediaPickerSources(params) {
  const acceptedParams = acceptParams(params, ['media_keyword', 'tags']);
  return createApiPromise('/api/mediapicker/sources/search', acceptedParams);
}

export function metadataValuesForMediaType(id) {
  return createApiPromise(`/api/metadata/${id}/values`);
}
/*
export function fetchMediaPickerSourcesByMetadata(params) {
  const acceptedParams = acceptParams(params, ['searchString', 'tags']);
  const paramStr = generateParamStr({ 'tags[]': acceptedParams.tags });
  const searchStr = acceptedParams.searchString || '*';
  return createApiPromise(`/api/sources/search/${searchStr}?${paramStr}`);
}
*/

export function fetchRecentNews() {
  return createApiPromise('/api/release-notes');
}
