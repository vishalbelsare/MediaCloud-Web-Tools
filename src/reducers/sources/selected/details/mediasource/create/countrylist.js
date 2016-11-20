import { FETCH_COUNTRY_LIST } from '../../../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../../../lib/reduxHelpers';

export const INITIAL_STATE = {
  list: null,
};

const countrylist = createAsyncReducer({
  initialState: INITIAL_STATE,
  action: FETCH_COUNTRY_LIST,
  handleSuccess: payload => ({
    list: payload,
  }),
});

export default countrylist;
