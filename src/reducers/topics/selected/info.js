import { FETCH_TOPIC_SUMMARY } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {},
  action: FETCH_TOPIC_SUMMARY,
  handleFetch: () => ({}),
  handleSuccess: (payload) => ({ ...payload.results }),
  handleFailure: () => ({}),
});

export default info;
