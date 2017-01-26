import { FETCH_FEATURED_COLLECTIONS_LIST } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const featured = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FEATURED_COLLECTIONS_LIST,
  handleSuccess: payload => ({
    list: payload.results.collections,
  }),
});

export default featured;
