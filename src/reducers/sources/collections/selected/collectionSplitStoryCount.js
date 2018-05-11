import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_COLLECTION_SPLIT_STORY_COUNT } from '../../../../actions/sourceActions';

const collectionSplitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_COLLECTION_SPLIT_STORY_COUNT,
});
export default collectionSplitStoryCount;
