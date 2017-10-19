import { FETCH_STORY_INFO } from '../../actions/storyActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const entities = createAsyncReducer({
  initialState: {
    info: [],
  },
  action: FETCH_STORY_INFO,
});

export default entities;
