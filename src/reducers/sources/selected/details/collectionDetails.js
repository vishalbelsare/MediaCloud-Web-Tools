import { FETCH_COLLECTION_DETAILS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionDetails = createAsyncReducer({
  initialState: {
    object: null,
  },
  action: FETCH_COLLECTION_DETAILS,
  handleFetch: () => ({ object: null }),
  handleSuccess: payload => ({
    object: payload.results,
  }),
  handleFailure: () => ({ object: null }),
});


export default collectionDetails;
