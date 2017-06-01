import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_SOURCE_SENTENCE_COUNT } from '../../actions/sourceActions';
import { calcSentences, cleanDateCounts, cleanCoverageGaps } from '../../lib/dateUtil';

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_SENTENCE_COUNT,
  handleSuccess: payload => ({
    total: calcSentences(payload.results.sentenceCounts),
    list: cleanDateCounts(payload.results.sentenceCounts),
    health: cleanCoverageGaps((payload.results.health) ? payload.results.health.coverage_gaps_list : null),
  }),
});
export default sentenceCount;
