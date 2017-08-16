import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_GEO, RESET_GEO } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const geo = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_QUERY_GEO,
  [RESET_GEO]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});

export default geo;
