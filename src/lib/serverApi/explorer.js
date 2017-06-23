import { createApiPromise, acceptParams } from '../apiUtil';

export function fetchSampleSearches() {
  return createApiPromise('/api/explorer/sample-searches');
}

export function fetchSavedSearches() {
  return createApiPromise('/api/explorer/saved-searches');
}

export function fetchQuerySentenceCounts(params) {
  const acceptedParams = acceptParams(params, ['index', 'q', 'start_date', 'end_date']);
  return createApiPromise('/api/explorer/sentences/count', acceptedParams);
}

export function fetchDemoQuerySentenceCounts(params) {
  const acceptedParams = acceptParams(params, ['index', 'search_id', 'query_id', 'q']);
  return createApiPromise('/api/explorer/demo/sentences/count', acceptedParams);
}

export function fetchDemoQuerySampleStories(params) {
  const acceptedParams = acceptParams(params, ['index', 'search_id', 'query_id', 'q']);
  return createApiPromise('/api/explorer/demo/stories/sample', acceptedParams);
}

export function fetchDemoQueryStoryCount(params) {
  const acceptedParams = acceptParams(params, ['index', 'search_id', 'query_id', 'q']);
  return createApiPromise('/api/explorer/demo/story/count', acceptedParams);
}

export function fetchDemoQueryGeo(params) {
  const acceptedParams = acceptParams(params, ['index', 'search_id', 'query_id', 'q']);
  return createApiPromise('api/explorer/demo/geo-tags/counts', acceptedParams);
}

export function demoQuerySourcesByIds(params) {
  const acceptedParams = acceptParams(params, ['sources']);
  acceptedParams['sources[]'] = params;
  return createApiPromise('api/explorer/demo/sources/list', acceptedParams);
}

export function demoQueryCollectionsByIds(params) {
  const acceptedParams = acceptParams(params, ['collections']);
  acceptedParams['collections[]'] = params;
  return createApiPromise('api/explorer/demo/collections/list', acceptedParams);
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error
