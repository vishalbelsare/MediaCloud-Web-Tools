import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SOURCE_COLLECTION_SENTENCE_COUNT } from '../../../../actions/sourceActions';
import { cleanDateCounts } from '../../../../lib/dateUtil';

const collectionSentenceCount = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_COLLECTION_SENTENCE_COUNT,
  handleSuccess: (payload) => ({
    total: payload.results.total,
    list: cleanDateCounts(payload.results.sentenceCounts),
  }),
});
export default collectionSentenceCount;
