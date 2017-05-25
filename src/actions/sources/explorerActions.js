import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/explorer';

export const FETCH_FEATURED_QUERY_LIST = 'FETCH_FEATURED_QUERY_LIST';
export const fetchFeaturedQueryList = createAsyncAction(FETCH_FEATURED_QUERY_LIST, api.fetchFeaturedQueryList);
