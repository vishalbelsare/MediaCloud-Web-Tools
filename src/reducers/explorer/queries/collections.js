import { createIndexedAsyncReducer } from '../../../lib/reduxHelpers';
import { FETCH_DEMO_QUERY_COLLECTIONS } from '../../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const sources = createIndexedAsyncReducer({
  action: FETCH_DEMO_QUERY_COLLECTIONS,
});

export default sources;
