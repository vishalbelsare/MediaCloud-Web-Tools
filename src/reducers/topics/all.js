import { FETCH_TOPIC_LIST, SET_TOPIC_LIST_FILTER, SET_TOPIC_FAVORITE } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

function updateFavorite(topicId, isFav, topicList) {
  // make sure to return a copy, so redux norms aren't violated
  const matching = [...topicList].find(t => t.topics_id === topicId);
  if (matching) {
    matching.isFavorite = isFav;
  }
  return topicList;
}

const all = createAsyncReducer({
  initialState: {
    topics: [],
    link_ids: {},
    currentFilter: null,
  },
  action: FETCH_TOPIC_LIST,
  [SET_TOPIC_LIST_FILTER]: payload => ({
    currentFilter: payload.currentFilter,
  }),
  [SET_TOPIC_FAVORITE]: (payload, state) => ({
    topics: {
      favorite: updateFavorite(payload.args[0], payload.args[1], state.topics.favorite),
      personal: updateFavorite(payload.args[0], payload.args[1], state.topics.personal),
      public: updateFavorite(payload.args[0], payload.args[1], state.topics.public),
    },
  }),
});

export default all;
