import { FETCH_TOPIC_TOP_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topWords = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_TOP_WORDS,
  handleSuccess: payload => ({
    list: payload,
  }),
});

export default topWords;
