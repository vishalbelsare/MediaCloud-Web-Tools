import { FETCH_MEDIA_STORIES, SORT_MEDIA_STORIES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers.js';

const topStories = createAsyncReducer({
  initialState: {
    sort: 'social',
    stories: [],
    links_ids: {}
  },
  action: FETCH_MEDIA_STORIES,
  SORT_MEDIA_STORIES: (payload) => ({ sort: payload }),
});

export default topStories;
