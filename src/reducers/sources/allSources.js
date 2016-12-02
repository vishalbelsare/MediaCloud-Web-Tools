
import { FETCH_SOURCE_LIST } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const allsources = createAsyncReducer({
  initialState: {
    results: null,
  },
  action: FETCH_SOURCE_LIST,
});

export default allsources;
