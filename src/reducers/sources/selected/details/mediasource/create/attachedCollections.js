import { FETCH_SOURCE_COLLECTIONS } from '../../../../../../actions/sourceActions';
import { createReducer } from '../../../../../../lib/reduxHelpers';

const attachedCollections = createReducer({
  initialState: {
    collections: [],
  },
  [FETCH_SOURCE_COLLECTIONS]: (payload, state) => ({
    collections: [...state.collections, payload],
  }),
});

export default attachedCollections;
