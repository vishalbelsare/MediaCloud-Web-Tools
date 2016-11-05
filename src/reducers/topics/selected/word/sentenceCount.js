import { FETCH_WORD_SENTENCE_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../../lib/dateUtil';

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_WORD_SENTENCE_COUNT,
  handleSuccess: payload => ({
    total: payload.count,
    counts: cleanDateCounts(payload.split),
  }),
});

export default sentenceCount;
