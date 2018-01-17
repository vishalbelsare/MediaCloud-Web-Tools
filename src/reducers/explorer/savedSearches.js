import { createAsyncReducer } from '../../lib/reduxHelpers';
import { LOAD_USER_SEARCHES } from '../../actions/explorerActions';

const searches = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: LOAD_USER_SEARCHES,
  handleSuccess: payload => ({
    list: payload,
    // add searchId to each query because we need it to properly track demo sample query requests
  }),
});
export default searches;
