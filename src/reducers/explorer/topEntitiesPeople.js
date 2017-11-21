import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_TOP_ENTITIES_PEOPLE, RESET_ENTITIES_PEOPLE } from '../../actions/systemActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const topEntitiesPeople = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_TOP_ENTITIES_PEOPLE,
  [RESET_ENTITIES_PEOPLE]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});
export default topEntitiesPeople;
