import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SPLIT_STORY_COUNT, RESET_SENTENCE_COUNTS, SELECT_SENTENCE_DATA_POINT,
  RESET_SENTENCE_DATA_POINT } from '../../actions/explorerActions';
import { cleanDateCounts } from '../../lib/dateUtil';

const storySplitCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0, dataPoint: null,
  }),
  action: FETCH_QUERY_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    counts: cleanDateCounts(payload.counts),
    total: payload.counts.reduce((total, info) => total + info.count, 0),  // sum it here so other widgets can use
  }),
  [SELECT_SENTENCE_DATA_POINT]: payload => ({
    dataPoint: payload,
  }),
  [RESET_SENTENCE_DATA_POINT]: () => ({
    dataPoint: null,
  }),
  [RESET_SENTENCE_COUNTS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0, dataPoint: null,
  }),
});

export default storySplitCount;
