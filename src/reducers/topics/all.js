import { FETCH_TOPIC_LIST } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    topics: [],
    link_ids: {},
  },
  action: FETCH_TOPIC_LIST,
});

export default all;
