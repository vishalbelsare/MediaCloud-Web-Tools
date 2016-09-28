
import { FETCH_SOURCE_DETAILS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';


const sourceDetails = createAsyncReducer({
  initialState: {
    object: null,
  },
  action: FETCH_SOURCE_DETAILS,
  handleFetch: () => ({ object: null, total: null }),
  handleSuccess: payload => ({
    total: payload.total,
    object: payload.results,
  }),
  handleFailure: () => ({ object: null, total: null }),
});


export default sourceDetails;
