import { FETCH_METADATA_VALUES } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const publicationState = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES,
  handleSuccess: payload => ({
    label: payload.tags.label,
    tags: payload.tags.tags,
    name: payload.tags.name,
  }),
});

export default publicationState;
