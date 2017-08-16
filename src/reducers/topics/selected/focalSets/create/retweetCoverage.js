import { FETCH_CREATE_FOCUS_RETWEET_COVERAGE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const retweetCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_RETWEET_COVERAGE,
});

export default retweetCoverage;
