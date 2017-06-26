import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_SAMPLE_SEARCHES } from '../../actions/explorerActions';

const samples = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SAMPLE_SEARCHES,
  handleSuccess: payload => ({
    list: payload.map(s => s),
  }),
});
export default samples;
