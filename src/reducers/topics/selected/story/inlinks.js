import { FETCH_STORY_INLINKS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const inlinks = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_STORY_INLINKS,
  handleSuccess: (payload) => ({
    list: payload,
  }),
});

export default inlinks;
