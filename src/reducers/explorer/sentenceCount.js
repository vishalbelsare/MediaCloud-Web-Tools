import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SENTENCE_COUNTS } from '../../actions/explorerActions';
import { calcSentences, cleanDateCounts } from '../../lib/dateUtil';

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
    index: 0,
  },
  action: FETCH_QUERY_SENTENCE_COUNTS,
  handleSuccess: payload => ({
    total: calcSentences(payload.results.sentenceCounts),
    list: cleanDateCounts(payload.results.sentenceCounts),
    index: payload.index,
  }),
});
export default sentenceCount;
