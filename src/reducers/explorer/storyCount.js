import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_DEMO_QUERY_STORY_COUNT } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const storyCount = createIndexedAsyncReducer({
  action: FETCH_DEMO_QUERY_STORY_COUNT,
});

export default storyCount;
