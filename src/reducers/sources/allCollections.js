import { FETCH_COLLECTION_LIST } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const allCollections = createAsyncReducer({
  initialState: {
    results: null,
  },
  action: FETCH_COLLECTION_LIST,
});

export default allCollections;
