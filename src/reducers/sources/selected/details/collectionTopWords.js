
import { FETCH_SOURCE_COLLECTION_TOP_WORDS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';


const collectionTopWords = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_COLLECTION_TOP_WORDS,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.total,
    list: payload.results,
  }),
  handleFailure: () => ({ list: [], total: null }),
});

export default collectionTopWords;

