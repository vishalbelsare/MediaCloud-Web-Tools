import { FETCH_FAVORITE_COLLECTIONS } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const favoritedCollections = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FAVORITE_COLLECTIONS,
});

export default favoritedCollections;
