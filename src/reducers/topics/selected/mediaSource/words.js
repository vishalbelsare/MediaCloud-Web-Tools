import { FETCH_MEDIA_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const words = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_MEDIA_WORDS,
  handleSuccess: (payload) => ({
    list: payload,
  }),
});

export default words;
