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
  const acceptedParams = acceptParams(params, ['mediaKeyword']);
  return createApiPromise('/api/mediapicker/collections/search', acceptedParams);
}

export function fetchMediaPickerSources(params) {
  const acceptedParams = acceptParams(params, ['mediaKeyword']);
  return createApiPromise('/api/mediapicker/sources/search', acceptedParams);
}
