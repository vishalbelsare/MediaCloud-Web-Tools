import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_TOP_WORDS, RESET_QUERY_TOP_WORDS, SELECT_COMPARATIVE_WORD_FIELD } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';
const LEFT = 0;

const topWords = createAsyncReducer({
  initialState: ({
    list: [],
    left: null,
    right: null,
  }),
  action: FETCH_QUERY_TOP_WORDS,
  handleSuccess: payload => ({
    // don't update left and right here because data (collections for example) may be packaged incorrectly
    list: payload.list,
  }),
  [SELECT_COMPARATIVE_WORD_FIELD]: (payload) => {
    if (payload.target === LEFT) return { left: payload.query };
    return { right: payload.query };
  },
  [RESET_QUERY_TOP_WORDS]: () => ({
    list: [],
  }),
});
export default topWords;
