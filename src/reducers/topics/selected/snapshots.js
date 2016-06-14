import { FETCH_TOPIC_SNAPSHOTS_LIST } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const snapshots = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_SNAPSHOTS_LIST,
});

export default snapshots;
