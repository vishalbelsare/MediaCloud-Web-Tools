import { FETCH_RECENT_NEWS } from '../../actions/systemActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const stats = createAsyncReducer({
  initialState: {
    releases: [],
  },
  action: FETCH_RECENT_NEWS,
});

export default stats;
