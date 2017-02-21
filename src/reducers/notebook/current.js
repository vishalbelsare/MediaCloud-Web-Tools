import { SAVE_TO_NOTEBOOK } from '../../actions/userActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const publicationCountry = createAsyncReducer({
  initialState: {
  },
  action: SAVE_TO_NOTEBOOK,
});

export default publicationCountry;
