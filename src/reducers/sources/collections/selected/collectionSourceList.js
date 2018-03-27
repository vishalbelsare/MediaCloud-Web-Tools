import { FETCH_COLLECTION_SOURCE_LIST } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionSourceList = createAsyncReducer({
  initialState: {
    sources: [],
  },
  action: FETCH_COLLECTION_SOURCE_LIST,
});

export default collectionSourceList;
