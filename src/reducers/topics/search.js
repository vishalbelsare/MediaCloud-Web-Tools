import { FETCH_TOPIC_SEARCH_RESULTS } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const search = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_TOPIC_SEARCH_RESULTS,
});

export default search;
