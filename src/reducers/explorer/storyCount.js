import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_STORY_COUNT, RESET_STORY_COUNTS } from '../../actions/explorerActions';

const storyCount = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_QUERY_STORY_COUNT,
  [RESET_STORY_COUNTS]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});

export default storyCount;
