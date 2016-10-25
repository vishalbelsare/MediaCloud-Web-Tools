import { FETCH_TOPIC_SUMMARY, SET_TOPIC_FAVORITE } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const info = createAsyncReducer({
  action: FETCH_TOPIC_SUMMARY,
  [SET_TOPIC_FAVORITE]: (payload, state) =>
    // when someone favorites the topic form the control bar, update it locally without refetch from server
    Object.assign({}, state, {
      ...state,
      isFavorite: payload.args[1],
    }),
});

export default info;
