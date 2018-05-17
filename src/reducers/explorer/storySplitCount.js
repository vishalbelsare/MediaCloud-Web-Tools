import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SPLIT_STORY_COUNT, RESET_STORY_SPLIT_COUNTS, SELECT_DATA_POINT,
  RESET_SELECTED_DATA_POINT } from '../../actions/explorerActions';
import { cleanDateCounts } from '../../lib/dateUtil';

const storySplitCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0, dataPoint: null,
  }),
  action: FETCH_QUERY_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    counts: cleanDateCounts(payload.results.with_keywords.counts),
    total: payload.results.with_keywords.counts.reduce((total, info) => total + info.count, 0),  // sum it here so other widgets can use
    normalizedCounts: cleanDateCounts(payload.results.without_keywords.counts),
    normalizedTotal: payload.results.without_keywords.counts.reduce((total, info) => total + info.count, 0),
  }),
  [SELECT_DATA_POINT]: payload => ({
    dataPoint: payload,
  }),
  [RESET_SELECTED_DATA_POINT]: () => ({
    dataPoint: null,
  }),
  [RESET_STORY_SPLIT_COUNTS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0, dataPoint: null,
  }),
});

export default storySplitCount;
