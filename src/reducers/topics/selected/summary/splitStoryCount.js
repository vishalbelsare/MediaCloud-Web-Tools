import { FETCH_TOPIC_SENTENCE_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../../lib/dateUtil';

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_TOPIC_SENTENCE_COUNT,
  handleSuccess: payload => ({
    total: payload.total_story_count,
    counts: cleanDateCounts(payload.counts),
  }),
});

export default sentenceCount;
