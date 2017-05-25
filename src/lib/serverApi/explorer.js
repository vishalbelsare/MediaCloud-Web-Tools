import { createApiPromise } from '../apiUtil';


export function fetchFeaturedQueries() {
  return createApiPromise('/api/explorer/featured-queries');
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error
