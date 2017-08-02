import { FETCH_TOPIC_UNDATEABLE_STORY_COUNTS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const undateableStoryTotals = createAsyncReducer({
  initialState: {
    counts: {
      count: 0,
      total: 0,
    },
  },
  action: FETCH_TOPIC_UNDATEABLE_STORY_COUNTS,
});

export default undateableStoryTotals;
