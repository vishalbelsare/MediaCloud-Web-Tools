import { FETCH_CREATE_FOCUS_MEDIA_TYPE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const mediaTypeCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_MEDIA_TYPE,
});

export default mediaTypeCoverage;
