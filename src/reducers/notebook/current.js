import { SAVE_TO_NOTEBOOK } from '../../actions/notebookActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const current = createAsyncReducer({
  initialState: {
  },
  action: SAVE_TO_NOTEBOOK,
});

export default current;
