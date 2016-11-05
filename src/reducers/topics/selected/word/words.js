import { FETCH_WORD_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const words = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_WORD_WORDS,
  handleSuccess: payload => ({
    list: payload,
  }),
});

export default words;
