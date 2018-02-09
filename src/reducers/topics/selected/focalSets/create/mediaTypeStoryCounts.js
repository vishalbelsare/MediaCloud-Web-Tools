import { FETCH_CREATE_FOCUS_MEDIA_TYPE_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const mediaTypeStoryCounts = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_MEDIA_TYPE_STORY_COUNTS,
});

export default mediaTypeStoryCounts;
