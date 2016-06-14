import { FETCH_TOPIC_TIMESPANS_LIST } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const timespans = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_TIMESPANS_LIST,
});

export default timespans;
