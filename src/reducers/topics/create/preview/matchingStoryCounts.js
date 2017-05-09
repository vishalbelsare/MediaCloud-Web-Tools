import { FETCH_CREATE_TOPIC_QUERY_STORY_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { MAX_RECOMMENDED_STORIES, MIN_RECOMMENDED_STORIES } from '../../../../lib/formValidators';

const storyTotals = createAsyncReducer({
  initialState: {
    count: null,
    canSave: false,
  },
  action: FETCH_CREATE_TOPIC_QUERY_STORY_COUNT,
  handleSuccess: payload => ({
    count: payload.count,
    canSave: (payload.count < MAX_RECOMMENDED_STORIES && payload.count > MIN_RECOMMENDED_STORIES),
  }),
});

export default storyTotals;
