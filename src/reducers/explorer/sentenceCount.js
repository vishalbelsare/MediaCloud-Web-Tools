import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SENTENCE_COUNTS, RESET_SENTENCE_COUNTS } from '../../actions/explorerActions';
import { ONE_DAY_RANGE } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';


const sentenceCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0,
  }),
  action: FETCH_QUERY_SENTENCE_COUNTS,
  handleSuccess: payload => ({
    ...payload,
    dateRangeSpread: payload.split.gap === ONE_DAY_RANGE,
    // add searchId to each query because we need it to properly track demo sample query requests
  }),
  [RESET_SENTENCE_COUNTS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [], dateRangeSpread: 0,
  }),
});
export default sentenceCount;
