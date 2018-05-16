import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_COLLECTION_SPLIT_STORY_COUNT } from '../../../../actions/sourceActions';
import { cleanDateCounts, cleanCoverageGaps } from '../../../../lib/dateUtil';

const collectionSplitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
    health: [],
    interval: 'day',
  },
  action: FETCH_COLLECTION_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: payload.results.total_story_count,
    list: cleanDateCounts(payload.results.list),
    health: cleanCoverageGaps((payload.results.health) ? payload.results.health.coverage_gaps_list : null),
  }),
});
export default collectionSplitStoryCount;
