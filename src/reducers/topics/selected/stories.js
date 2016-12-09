import { FETCH_TOPIC_INFLUENTIAL_STORIES, SORT_TOPIC_INFLUENTIAL_STORIES } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const influentialStories = createAsyncReducer({
  initialState: {
    stories: [],
    link_ids: {},
    sort: 'inlink',
  },
  action: FETCH_TOPIC_INFLUENTIAL_STORIES,
  [SORT_TOPIC_INFLUENTIAL_STORIES]: payload => ({ sort: payload }),
});

export default influentialStories;
