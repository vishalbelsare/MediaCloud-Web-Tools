import { FETCH_TOPIC_SUMMARY } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const info = createAsyncReducer({
  action: FETCH_TOPIC_SUMMARY,
  SET_TOPIC_FAVORITE_RESOLVED: (payload, state) => ({
    // changing fav status returns full topic info, so update it here
    ...state,
    ...payload,
  }),
});

export default info;
