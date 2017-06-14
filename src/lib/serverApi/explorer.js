import { createApiPromise, acceptParams } from '../apiUtil';

export function fetchSampleSearches() {
  return createApiPromise('/api/explorer/sample-searches');
}

export function fetchSavedSearches() {
  return createApiPromise('/api/explorer/saved-searches');
}

export function fetchQuerySentenceCounts(params) {
  const acceptedParams = acceptParams(params, ['q', 'start_date', 'end_date']);
  return createApiPromise('/api/explorer/sentences/count', acceptedParams);
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error
