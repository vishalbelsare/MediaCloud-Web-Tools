import { FETCH_COLLECTION_DETAILS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionDetails = createAsyncReducer({
  initialState: {
    object: null,
  },
  action: FETCH_COLLECTION_DETAILS,
  handleSuccess: payload => ({
    object: payload.results,
  }),
});


export default collectionDetails;
