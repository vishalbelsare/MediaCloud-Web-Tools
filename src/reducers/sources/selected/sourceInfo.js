
import { FETCH_SOURCE_INFO } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const sourceInfo = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_INFO,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: payload => ({
    total: payload.results.total,
    list: payload.results,
  }),
  handleFailure: () => ({ list: [], total: null }),
});


export default sourceInfo;
