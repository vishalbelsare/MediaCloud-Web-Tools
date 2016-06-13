import { FETCH_TOPIC_SNAPSHOTS_LIST } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const snapshots = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_SNAPSHOTS_LIST,
  handleFetch: () => ({ list: [] }),
  handleSuccess: (payload) => ({ list: payload.results }),
  handleFailure: () => ({ list: [] }),
});

export default snapshots;
