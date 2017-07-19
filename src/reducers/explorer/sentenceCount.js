import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_DEMO_QUERY_SENTENCE_COUNTS, RESET_SENTENCE_COUNTS } from '../../actions/explorerActions';

const sentenceCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_DEMO_QUERY_SENTENCE_COUNTS,
  [RESET_SENTENCE_COUNTS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});
export default sentenceCount;
