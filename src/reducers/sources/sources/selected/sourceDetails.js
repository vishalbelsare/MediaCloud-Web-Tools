
import { FETCH_SOURCE_DETAILS, SET_FAVORITE_SOURCE } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const sourceDetails = createAsyncReducer({
  initialState: {
  },
  action: FETCH_SOURCE_DETAILS,
  [SET_FAVORITE_SOURCE]: (payload, state) => ({
    ...state,
    isFavorite: payload.args[1],
  }),
});


export default sourceDetails;
