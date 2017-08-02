import { FETCH_TOPIC_NYT_TAG_COVERAGE } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const themedStoryTotals = createAsyncReducer({
  initialState: {
    counts: {
      count: 0,
      total: 0,
    },
  },
  action: FETCH_TOPIC_NYT_TAG_COVERAGE,
});

export default themedStoryTotals;
