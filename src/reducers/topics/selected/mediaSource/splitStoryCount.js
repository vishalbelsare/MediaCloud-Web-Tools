import { FETCH_MEDIA_SPLIT_STORY_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../../lib/dateUtil';

const splitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_MEDIA_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: payload.total_story_count,
    counts: cleanDateCounts(payload.counts),
  }),
});

export default splitStoryCount;
