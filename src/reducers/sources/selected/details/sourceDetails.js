
import { FETCH_SOURCE_DETAILS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';


const sourceDetails = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_DETAILS,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.total,
    list: payload.results,
  }),
  handleFailure: () => ({ list: [], total: null }),
});


export default sourceDetails;
