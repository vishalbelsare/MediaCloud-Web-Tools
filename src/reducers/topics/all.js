import { FETCH_TOPIC_LIST, SET_TOPIC_LIST_FILTER } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    topics: [],
    link_ids: {},
    currentFilter: 'favorites',
  },
  action: FETCH_TOPIC_LIST,
  [SET_TOPIC_LIST_FILTER]: payload => ({
    currentFilter: payload.currentFilter,
  }),
});

export default all;
