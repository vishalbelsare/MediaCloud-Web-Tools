import { FETCH_SOURCE_SUGGESTIONS } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const suggestions = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_SUGGESTIONS,
});

export default suggestions;
