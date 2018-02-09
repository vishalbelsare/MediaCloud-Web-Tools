import { FETCH_CREATE_FOCUS_MEDIA_TYPE_COVERAGE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const mediaTypeCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_MEDIA_TYPE_COVERAGE,
});

export default mediaTypeCoverage;
