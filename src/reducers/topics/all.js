import { FETCH_TOPIC_LIST, SET_TOPIC_LIST_FILTER, SET_TOPIC_FAVORITE } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    topics: [],
    link_ids: {},
    currentFilter: 'favorites',
  },
  action: FETCH_TOPIC_LIST,
  [SET_TOPIC_LIST_FILTER]: payload => ({
    // when someone favorites the topic, change the start appropriately so we don't have to refetch them all from the server
    currentFilter: payload.currentFilter,
  }),
  [SET_TOPIC_FAVORITE]: (payload, state) => {
    // when someone favorites the topic, change the start appropriately so we don't have to refetch them all from the server
    const topics = state.topics.slice(); // clone the array
    topics.forEach((t, index) => {
      if (t.topics_id === payload.args[0]) {
        topics[index].isFavorite = payload.args[1];
      }
    });
    return {
      topics,
    };
  },
});

export default all;
