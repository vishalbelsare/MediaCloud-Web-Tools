import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/serverApi/sources';

export const FETCH_FEATURED_QUERY_LIST = 'FETCH_FEATURED_QUERY_LIST';
export const fetchFeaturedQueries = createAsyncAction(FETCH_FEATURED_QUERY_LIST, api.fetchFeaturedQueries, id => id);
