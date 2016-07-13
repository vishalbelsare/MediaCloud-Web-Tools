import { FETCH_STORY_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_STORY_WORDS,
  handleSuccess: (payload) => ({
    list: payload,
  }),
});

export default info;
