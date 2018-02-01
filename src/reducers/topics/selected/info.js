import { FETCH_TOPIC_SUMMARY } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const info = createAsyncReducer({
  action: FETCH_TOPIC_SUMMARY,
  UPDATE_TOPIC_RESOLVED: payload => ({ ...payload }),
  SET_TOPIC_FAVORITE_RESOLVED: payload => ({
    // changing fav status returns full topic info, so update it here
    ...payload,
  }),
});

export default info;
