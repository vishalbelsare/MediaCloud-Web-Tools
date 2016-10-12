import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SOURCE_SENTENCE_COUNT } from '../../../../actions/sourceActions';
import { cleanDateCounts, cleanCoverageGaps } from '../../../../lib/dateUtil';

const sentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_SENTENCE_COUNT,
  handleSuccess: payload => ({
    total: payload.results.total,
    list: cleanDateCounts(payload.results.sentenceCounts),
    health: cleanCoverageGaps(payload.results.health.coverage_gaps_list),
  }),
});
export default sentenceCount;
