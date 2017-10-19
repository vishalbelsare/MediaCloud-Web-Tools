import { FETCH_ADMIN_TOPIC_LIST } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const adminList = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_ADMIN_TOPIC_LIST,
});

export default adminList;
