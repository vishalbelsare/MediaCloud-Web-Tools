import { FETCH_CREATE_TOPIC_QUERY_ATTENTION } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
// import { cleanDateCounts } from '../../../../lib/dateUtil';

const matchingAttention = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_TOPIC_QUERY_ATTENTION,
  handleSuccess: payload => ({
    // TODO
    total: payload.numFound,
    counts: payload.docs,
    // cleanDateCounts(payload.split),
  }),
});

export default matchingAttention;
