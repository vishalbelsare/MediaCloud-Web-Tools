import { createAsyncReducer } from '../../lib/reduxHelpers';
import { LOAD_USER_SEARCHES } from '../../actions/explorerActions';

const searches = createAsyncReducer({
  action: LOAD_USER_SEARCHES,
});
export default searches;
