import { FETCH_FAVORITE_TOPICS } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const favorite = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_FAVORITE_TOPICS,
});

export default favorite;
