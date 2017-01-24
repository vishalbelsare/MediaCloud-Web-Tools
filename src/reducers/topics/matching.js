import { FETCH_MATCHING_TOPICS } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const matching = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_MATCHING_TOPICS,
  handleSuccess: payload => ({
    // add name and id so we can display it in an autocomplete
    list: payload.list.map(t => ({ name: t.name, id: t.topics_id })),
  }),
});

export default matching;
