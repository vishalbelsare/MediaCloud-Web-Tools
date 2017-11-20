import { FETCH_TOP_ENTITIES_PEOPLE } from '../../actions/systemActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const topPeopleCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    entities: [],
  },
  action: FETCH_TOP_ENTITIES_PEOPLE,
});

export default topPeopleCoverage;
