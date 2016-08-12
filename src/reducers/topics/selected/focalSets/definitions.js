import { FETCH_FOCAL_SET_DEFINITIONS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const list = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FOCAL_SET_DEFINITIONS,
  handleSuccess: (payload) => ({
    list: payload,
  }),
});

export default list;
