import { FETCH_STORY_ENTITIES } from '../../actions/storyActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const entities = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_STORY_ENTITIES,
});

export default entities;
