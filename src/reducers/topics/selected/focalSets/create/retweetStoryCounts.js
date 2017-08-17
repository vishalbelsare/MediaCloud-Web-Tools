import { FETCH_CREATE_FOCUS_RETWEET_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const retweetStoryCounts = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_RETWEET_STORY_COUNTS,
});

export default retweetStoryCounts;
