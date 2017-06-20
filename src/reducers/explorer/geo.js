import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_DEMO_QUERY_GEO } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const geo = createIndexedAsyncReducer({
  action: FETCH_DEMO_QUERY_GEO,
});

export default geo;
