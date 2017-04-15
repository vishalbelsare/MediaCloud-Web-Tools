import { FETCH_COLLECTION_SOURCE_SENTENCE_HISTORICAL_COUNTS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const historicalSentenceCounts = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_COLLECTION_SOURCE_SENTENCE_HISTORICAL_COUNTS,
});

export default historicalSentenceCounts;
