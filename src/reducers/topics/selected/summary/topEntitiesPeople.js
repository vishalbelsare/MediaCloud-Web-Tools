import { FETCH_TOP_ENTITIES_PEOPLE_COVERAGE } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topPeopleCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_TOP_ENTITIES_PEOPLE_COVERAGE,
});

export default topPeopleCoverage;
