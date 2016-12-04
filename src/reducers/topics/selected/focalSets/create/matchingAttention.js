import { FETCH_CREATE_FOCUS_KEYWORD_ATTENTION } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../../../lib/dateUtil';

const matchingAttention = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_KEYWORD_ATTENTION,
  handleSuccess: payload => ({
    total: payload.count,
    counts: cleanDateCounts(payload.split),
  }),
});

export default matchingAttention;
