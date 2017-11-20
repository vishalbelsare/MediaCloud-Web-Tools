import { FETCH_CREATE_FOCUS_NYT_THEME_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const nytThemeStoryCounts = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_NYT_THEME_STORY_COUNTS,
});

export default nytThemeStoryCounts;
