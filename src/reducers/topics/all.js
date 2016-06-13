import { FETCH_TOPIC_LIST } from '../../actions/topicActions';
import { createAsyncReducer, arrayToDict } from '../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    list: {},
  },
  action: FETCH_TOPIC_LIST,
  handleFetch: () => ({ list: {} }),
  handleSuccess: (payload) => ({ list: arrayToDict(payload.results, 'controversies_id') }),
  handleFailure: () => ({ list: {} }),
});

export default all;
