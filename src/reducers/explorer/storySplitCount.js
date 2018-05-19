import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SPLIT_STORY_COUNT, RESET_STORY_SPLIT_COUNTS, SELECT_DATA_POINT,
  RESET_SELECTED_DATA_POINT } from '../../actions/explorerActions';
import { cleanDateCounts } from '../../lib/dateUtil';

const storySplitCount = createIndexedAsyncReducer({
  initialState: ({
    counts: [],
  }),
  action: FETCH_QUERY_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    counts: cleanDateCounts(payload.results.counts),
    total: payload.results.total,
    normalizedTotal: payload.results.normalzied_total,
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
