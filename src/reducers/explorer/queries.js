import { createReducer } from '../../lib/reduxHelpers';
import { SET_QUERY_LIST } from '../../actions/explorerActions';

/* function queries(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_QUERY_LIST:
      return action.payload ? parseInt(action.payload, 10) : [];
    default:
      return state;
  }
} */

const queries = createReducer({
  initialState: {
    list: [],
  },
  [SET_QUERY_LIST]: payload => ({
    list: payload,
  }),
});

export default queries;
