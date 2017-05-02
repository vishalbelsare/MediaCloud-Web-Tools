import { FETCH_WORD_SENTENCE_COUNT_BY_MATCH } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../../lib/dateUtil';

const matchingAttention = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_WORD_SENTENCE_COUNT_BY_MATCH,
  handleSuccess: payload => ({
    total: payload.count,
    counts: cleanDateCounts(payload.split),
  }),
});

export default matchingAttention;
