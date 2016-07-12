import { FETCH_STORY, SELECT_STORY } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const influentialStories = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_STORY,
  SELECT_STORY: (payload) => ({ id: payload }),
});

export default influentialStories;
