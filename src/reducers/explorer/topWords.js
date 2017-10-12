import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_TOP_WORDS, RESET_QUERY_TOP_WORDS } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const topWords = createAsyncReducer({
  initialState: ({
    list: [],
  }),
  action: FETCH_QUERY_TOP_WORDS,
  handleSuccess: payload => ({
    // override default handler so we can change the string dates into JS date objects
    list: payload.list,
  }),
  [RESET_QUERY_TOP_WORDS]: () => ({
    list: [],
  }),
});
export default topWords;
