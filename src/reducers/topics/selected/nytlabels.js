import { FETCH_TOPIC_NYT_LABEL_COUNTS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const nytlabels = createAsyncReducer({
  initialState: {
    tree: {},
  },
  action: FETCH_TOPIC_NYT_LABEL_COUNTS,
});

export default nytlabels;
