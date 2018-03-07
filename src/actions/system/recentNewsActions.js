import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';

export const FETCH_RECENT_NEWS = 'FETCH_RECENT_NEWS';

export const fetchRecentNews = createAsyncAction(FETCH_RECENT_NEWS, api.fetchRecentNews);
