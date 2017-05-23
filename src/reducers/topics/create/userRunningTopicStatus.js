import { FETCH_USER_QUEUED_RUNNING_TOPICS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const userRunningTopicStatus = createAsyncReducer({
  initialState: {
    runningTopic: null,
    allowed: true,
  },
  action: FETCH_USER_QUEUED_RUNNING_TOPICS,
  handleSuccess: payload => ({
    runningTopic: payload,
    allowed: payload == null || payload.length === 0,
  }),
});

export default userRunningTopicStatus;
