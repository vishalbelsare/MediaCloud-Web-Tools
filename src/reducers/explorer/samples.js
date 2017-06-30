import { createAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_SAMPLE_SEARCHES } from '../../actions/explorerActions';

const samples = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SAMPLE_SEARCHES,
  handleSuccess: payload => ({
    list: payload.map((s, idx) => ({
      ...s, queries: s.queries.map(q => ({ ...q, searchId: idx })),
    })),
    // add searchId to each query because we need it to properly track demo sample query requests
  }),
});
export default samples;
