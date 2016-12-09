import { FETCH_MEDIA_STORIES, SORT_MEDIA_STORIES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topStories = createAsyncReducer({
  initialState: {
    sort: 'inlink',
    stories: [],
    links_ids: {},
  },
  action: FETCH_MEDIA_STORIES,
  [SORT_MEDIA_STORIES]: payload => ({ sort: payload }),
});

export default topStories;
