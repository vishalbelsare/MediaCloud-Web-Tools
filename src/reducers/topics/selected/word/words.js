import { FETCH_TOPIC_TOP_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const words = createAsyncReducer({
  initialState: {
    list: [],
    totals: [], // options topic/focus-level totals to compare to
  },
  action: FETCH_TOPIC_TOP_WORDS,
});

export default words;
