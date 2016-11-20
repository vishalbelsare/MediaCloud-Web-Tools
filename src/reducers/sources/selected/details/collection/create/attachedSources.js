import { ADD_THIS_SOURCE_TO_COLLECTION } from '../../../../../../actions/sourceActions';
import { createReducer } from '../../../../../../lib/reduxHelpers';

const attachedSources = createReducer({
  initialState: {
    sources: [],
  },
  [ADD_THIS_SOURCE_TO_COLLECTION]: (payload, state) => ({
    sources: [...state.sources, payload],
  }),
});

export default attachedSources;
