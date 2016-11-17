import { ADD_SOURCES_TO_COLLECTION } from '../../../../../../actions/sourceActions';
import { createReducer } from '../../../../../../lib/reduxHelpers';

const attachedSources = createReducer({
  initialState: {
    sources: [],
  },
  [ADD_SOURCES_TO_COLLECTION]: (payload, state) => ({
    sources: [...state.sources, payload],
  }),
});

export default attachedSources;
