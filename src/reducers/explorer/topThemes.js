import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_TOP_THEMES, RESET_THEMES } from '../../actions/explorerActions';

const topThemes = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_TOP_THEMES,
  [RESET_THEMES]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});
export default topThemes;
