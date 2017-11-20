import { FETCH_CREATE_FOCUS_TOP_COUNTRIES_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const topStoriesStoryCounts = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_TOP_COUNTRIES_STORY_COUNTS,
});

export default topStoriesStoryCounts;
