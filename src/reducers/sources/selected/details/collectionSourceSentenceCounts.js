import { FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionSourceSentenceCounts = createAsyncReducer({
  initialState: {
    list: [],
    sources: [],
  },
  action: FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS,
});

export default collectionSourceSentenceCounts;
