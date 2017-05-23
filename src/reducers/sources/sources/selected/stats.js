import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SOURCE_STATS } from '../../../../actions/sourceActions';

const stats = createAsyncReducer({
  initialState: {
  },
  action: FETCH_SOURCE_STATS,
});
export default stats;
