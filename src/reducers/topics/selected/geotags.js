import { FETCH_TOPIC_GEOCODED_STORY_COUNTS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const geotags = createAsyncReducer({
  initialState: {
    results: [],
  },
  action: FETCH_TOPIC_GEOCODED_STORY_COUNTS,
});

export default geotags;
