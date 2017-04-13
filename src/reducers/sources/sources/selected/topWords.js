
import { FETCH_SOURCE_TOP_WORDS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';


const topWords = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_TOP_WORDS,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: payload => ({
    total: payload.total,
    list: payload.results,
    timePeriod: payload.timePeriod,
  }),
  handleFailure: () => ({ list: [], total: null }),
});

export default topWords;

