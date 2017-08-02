import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_SYSTEM_STATS = 'FETCH_SYSTEM_STATS';

export const fetchSystemStats = createAsyncAction(FETCH_SYSTEM_STATS, api.systemStats);
