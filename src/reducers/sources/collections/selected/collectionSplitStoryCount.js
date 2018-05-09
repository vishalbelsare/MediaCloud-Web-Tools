import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_COLLECTION_SPLIT_STORY_COUNT } from '../../../../actions/sourceActions';
import { calcSentences, cleanDateCounts } from '../../../../lib/dateUtil';

const collectionSplitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_COLLECTION_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: calcSentences(payload.results.splitStoryCounts),
    list: cleanDateCounts(payload.results.splitStoryCounts),
  }),
});
export default collectionSplitStoryCount;
