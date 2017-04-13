import { FETCH_METADATA_VALUES } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const publicationCountry = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES,
});

export default publicationCountry;
