import { FETCH_COLLECTION_TO_COPY } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const toCopy = createAsyncReducer({
  initialState: {
    media: [],
  },
  action: FETCH_COLLECTION_TO_COPY,
});

export default toCopy;
