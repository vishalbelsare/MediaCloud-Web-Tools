import { FETCH_CREATE_TOPIC_QUERY_STORY_SAMPLE } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const matchingStorySamples = createAsyncReducer({
  initialState: {
    stories: [],
    links_ids: {},
  },
  action: FETCH_CREATE_TOPIC_QUERY_STORY_SAMPLE,
});

export default matchingStorySamples;
