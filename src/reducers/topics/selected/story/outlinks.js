import { FETCH_STORY_OUTLINKS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const outlinks = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_STORY_OUTLINKS,
  handleSuccess: (payload) => ({
    list: payload,
  }),
});

export default outlinks;
