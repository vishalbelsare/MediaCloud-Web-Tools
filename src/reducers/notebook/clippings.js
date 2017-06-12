import { FETCH_NOTEBOOK_CLIPPINGS } from '../../actions/notebookActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const clippings = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_NOTEBOOK_CLIPPINGS,
});

export default clippings;
