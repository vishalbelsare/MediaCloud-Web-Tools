import { FETCH_CREATE_FOCUS_NYT_THEME_COVERAGE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const nytThemeCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_NYT_THEME_COVERAGE,
});

export default nytThemeCoverage;
