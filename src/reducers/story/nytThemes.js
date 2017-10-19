import { FETCH_STORY_NYT_THEMES } from '../../actions/storyActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const entities = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_STORY_NYT_THEMES,
});

export default entities;
