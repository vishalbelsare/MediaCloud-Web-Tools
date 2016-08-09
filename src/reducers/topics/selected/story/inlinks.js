import { FETCH_STORY_INLINKS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const inlinks = createAsyncReducer({
  initialState: {
    stories: [],
    links_ids: {},
  },
  action: FETCH_STORY_INLINKS,
});

export default inlinks;
