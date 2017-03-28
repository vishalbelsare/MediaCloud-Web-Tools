import { FETCH_SYSTEM_STATS } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const stats = createAsyncReducer({
  initialState: {
    object: null,
  },
  action: FETCH_SYSTEM_STATS,
});

export default stats;
