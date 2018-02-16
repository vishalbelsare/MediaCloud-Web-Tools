import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_PER_DATE_TOP_WORDS } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const topWordsPerDateRange = createAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_QUERY_PER_DATE_TOP_WORDS,
});

export default topWordsPerDateRange;
