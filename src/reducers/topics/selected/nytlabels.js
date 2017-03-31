import { FETCH_TOPIC_NYT_TAG_COUNTS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const nytlabels = createAsyncReducer({
  initialState: {
    results: [],
  },
  action: FETCH_TOPIC_NYT_TAG_COUNTS,
});

export default nytlabels;
