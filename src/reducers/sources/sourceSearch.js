
import { FETCH_SOURCE_SEARCH } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';


const sourceSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_SEARCH,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.total,
    list: payload.results,
  }),
  handleFailure: () => ({ list: [], total: null }),
});


export default sourceSearch;
