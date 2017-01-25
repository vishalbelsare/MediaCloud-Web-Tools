import { FETCH_FULL_TOPIC_LIST } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const full = createAsyncReducer({
  initialState: {
    list: { cached: false, topics: [] },
  },
  action: FETCH_FULL_TOPIC_LIST,
});

export default full;
