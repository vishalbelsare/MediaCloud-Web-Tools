import { FETCH_FAVORITE_SOURCES } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const favorited = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FAVORITE_SOURCES,
});

export default favorited;
