import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SAMPLE_STORIES, RESET_SAMPLES } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const stories = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_QUERY_SAMPLE_STORIES,
  [RESET_SAMPLES]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});

export default stories;
