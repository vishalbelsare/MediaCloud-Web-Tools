import { FETCH_PUBLIC_TOPICS_LIST } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const publiclist = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_PUBLIC_TOPICS_LIST,
});

export default publiclist;
