import { FETCH_TOPIC_FOCAL_SETS_LIST } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const list = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_FOCAL_SETS_LIST,
  handleSuccess: (payload) => ({
    list: payload,
  }),
});

export default list;
