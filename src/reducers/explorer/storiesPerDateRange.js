import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_PER_DATE_SAMPLE_STORIES, RESET_SAMPLE_STORIES } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const storiesPerDateRange = createAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_QUERY_PER_DATE_SAMPLE_STORIES,
  [RESET_SAMPLE_STORIES]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});

export default storiesPerDateRange;
