import { FETCH_TOPIC_SUMMARY } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const info = createAsyncReducer({ action: FETCH_TOPIC_SUMMARY });

export default info;
