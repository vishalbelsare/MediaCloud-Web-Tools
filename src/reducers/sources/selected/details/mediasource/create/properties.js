import { FETCH_COUNTRY_LIST } from '../../../../../../actions/sourceActions';
import { createReducer } from '../../../../../../lib/reduxHelpers';

export const INITIAL_STATE = {
  list: null,
};

const countryList = createReducer({
  initialState: INITIAL_STATE,
  [FETCH_COUNTRY_LIST]: payload => ({ ...payload }),
});

export default countryList;
