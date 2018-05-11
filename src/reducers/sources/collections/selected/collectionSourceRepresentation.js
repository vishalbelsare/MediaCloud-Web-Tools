import { FETCH_COLLECTION_SOURCE_REPRESENTATION } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionSourceRepresentation = createAsyncReducer({
  initialState: {
    list: [],
    sources: [],
  },
  action: FETCH_COLLECTION_SOURCE_REPRESENTATION,
});

export default collectionSourceRepresentation;
