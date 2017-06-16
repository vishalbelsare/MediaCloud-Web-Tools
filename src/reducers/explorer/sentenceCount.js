import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_DEMO_QUERY_SENTENCE_COUNTS } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const sentenceCount = createIndexedAsyncReducer({
  action: FETCH_DEMO_QUERY_SENTENCE_COUNTS,
});
/*
const sentenceCount = createAsyncReducer({
  initialState: {
    total: [],
    list: [],
    index: 0,
  },
  handleSuccess: (payload, state, meta) => {
    const params = meta.args[0];
    const queryId = parseInt(params.query_id, 10);
    const updatedState = {...state}; // we have to clone b/c may be empty
    updatedState.total.push({ id: queryId, count: payload.count });
    updatedState.list.push({ id: queryId, list: cleanDateCounts(payload.split) });
    if (updatedState.total.length > 2) { // waiting for async update
      updatedState.fetchStatus = fetchConstants.FETCH_SUCCEEDED;
    }
    return updatedState;
  },
});
*/

export default sentenceCount;
