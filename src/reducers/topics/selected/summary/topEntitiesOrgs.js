import { FETCH_TOP_ENTITIES_ORGS_COVERAGE } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const topEntitiesOrgs = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    entities: [],
  },
  action: FETCH_TOP_ENTITIES_ORGS_COVERAGE,
});

export default topEntitiesOrgs;
