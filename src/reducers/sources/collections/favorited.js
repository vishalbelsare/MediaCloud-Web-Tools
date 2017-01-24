import { FETCH_FAVORITE_COLLECTIONS } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const favorited = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FAVORITE_COLLECTIONS,
});

export default favorited;
