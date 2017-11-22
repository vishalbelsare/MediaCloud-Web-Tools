import { FETCH_CREATE_FOCUS_TOP_COUNTRIES_COVERAGE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const topCountriesCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_FOCUS_TOP_COUNTRIES_COVERAGE,
});

export default topCountriesCoverage;
