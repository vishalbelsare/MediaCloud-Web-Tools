import { FETCH_WORD_STORIES, SORT_WORD_STORIES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topStories = createAsyncReducer({
  initialState: {
    sort: 'inlink',
    stories: [],
    links_ids: {},
  },
  action: FETCH_WORD_STORIES,
  [SORT_WORD_STORIES]: payload => ({ sort: payload }),
});

export default topStories;
