import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_SOURCE_SENTENCE_COUNT } from '../../actions/sourceActions';
import { calcSentences, cleanDateCounts } from '../../lib/dateUtil';

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
    index: 0,
  },
  action: FETCH_SOURCE_SENTENCE_COUNT,
  handleSuccess: payload => ({
    total: calcSentences(payload.results.sentenceCounts),
    list: cleanDateCounts(payload.results.sentenceCounts),
    index: payload.index,
  }),
});
export default sentenceCount;
