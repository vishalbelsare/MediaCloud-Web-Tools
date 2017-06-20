import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_DEMO_QUERY_SAMPLE_STORIES } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const stories = createIndexedAsyncReducer({
  action: FETCH_DEMO_QUERY_SAMPLE_STORIES,
});

export default stories;
