import { FETCH_TOP_ENTITIES_ORGS } from '../../actions/systemActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const topEntitiesOrgs = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    entities: [],
  },
  action: FETCH_TOP_ENTITIES_ORGS,
});

export default topEntitiesOrgs;
