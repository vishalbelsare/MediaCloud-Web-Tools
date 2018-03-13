import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SENTENCE_COUNTS, RESET_SENTENCE_COUNTS, SELECT_SENTENCE_DATA_POINT, RESET_SENTENCE_DATA_POINT } from '../../actions/explorerActions';
import { ONE_DAY_RANGE } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';


const sentenceCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0, dataPoint: null,
  }),
  action: FETCH_QUERY_SENTENCE_COUNTS,
  handleSuccess: payload => ({
    ...payload,
    dateRangeSpread: payload.split.gap === ONE_DAY_RANGE,
    // add searchId to each query because we need it to properly track demo sample query requests
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
export default sentenceCount;
