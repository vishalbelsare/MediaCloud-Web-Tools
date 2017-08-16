import { createIndexedAsyncReducer } from '../../../lib/reduxHelpers';
import { FETCH_QUERY_COLLECTIONS } from '../../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const collections = createIndexedAsyncReducer({
  action: FETCH_QUERY_COLLECTIONS,
});

export default collections;
