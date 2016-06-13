import { FETCH_TOPIC_TOP_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topWords = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_TOP_WORDS,
  handleFetch: () => ({ list: [] }),
  handleSuccess: (payload) => ({ list: payload.results }),
  handleFailure: () => ({ list: [] }),
});

export default topWords;
