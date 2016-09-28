import { FETCH_TOPIC_PERMISSIONS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const permissions = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_PERMISSIONS,
  handleSuccess: payload => ({
    list: payload.permissions,
  }),
});

export default permissions;
