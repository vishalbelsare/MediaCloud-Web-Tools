
import { FETCH_COLLECTION_TOP_WORDS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';


const collectionTopWords = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_COLLECTION_TOP_WORDS,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: payload => ({
    total: payload.total,
    list: payload.results,
  }),
  handleFailure: () => ({ list: [], total: null }),
});

export default collectionTopWords;

