import { FETCH_POPULAR_COLLECTIONS_LIST } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const popular = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_POPULAR_COLLECTIONS_LIST,
  handleSuccess: payload => ({
    list: payload.results.collections,
  }),
});

export default popular;
