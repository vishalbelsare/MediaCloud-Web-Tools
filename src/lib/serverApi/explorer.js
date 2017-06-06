import { createApiPromise, createPostingApiPromise, acceptParams } from '../apiUtil';


export function fetchSavedQueries() {
  return createApiPromise('/api/explorer/saved-queries');
}

export function fetchQuerySentenceCounts(params) {
  const acceptedParams = acceptParams(params, ['index', 'q', 'start_date', 'end_date', 'sources[]', 'collections[]']);
  return createPostingApiPromise('api/explorer/sentences/count', acceptedParams);
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error
