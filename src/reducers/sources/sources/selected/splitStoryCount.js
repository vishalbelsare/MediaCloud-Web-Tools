import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SOURCE_SPLIT_STORY_COUNT } from '../../../../actions/sourceActions';
import { calcSentences, cleanDateCounts, cleanCoverageGaps } from '../../../../lib/dateUtil';

const splitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: calcSentences(payload.results.splitStoryCounts),
    list: cleanDateCounts(payload.results.splitStoryCounts),
    health: cleanCoverageGaps((payload.results.health) ? payload.results.health.coverage_gaps_list : null),
  }),
});
export default splitStoryCount;
