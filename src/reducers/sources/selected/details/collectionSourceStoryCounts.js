import { FETCH_COLLECTION_SOURCE_STORY_COUNTS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionSourceStoryCounts = createAsyncReducer({
  initialState: {
    list: [],
    sources: [],
  },
  action: FETCH_COLLECTION_SOURCE_STORY_COUNTS,
});

export default collectionSourceStoryCounts;
