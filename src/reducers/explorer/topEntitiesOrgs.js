import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_TOP_ENTITIES_ORGS, RESET_ENTITIES_ORGS } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const topEntitiesPeople = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_TOP_ENTITIES_ORGS,
  [RESET_ENTITIES_ORGS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});
export default topEntitiesPeople;
