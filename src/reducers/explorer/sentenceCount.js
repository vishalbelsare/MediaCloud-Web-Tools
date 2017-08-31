import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SENTENCE_COUNTS, RESET_SENTENCE_COUNTS } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const sentenceCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_QUERY_SENTENCE_COUNTS,
  [RESET_SENTENCE_COUNTS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});
export default sentenceCount;
