import { FETCH_SOURCE_METADATA } from '../../../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../../../lib/reduxHelpers';

export const INITIAL_STATE = {
  list: null,
};

const createSourceReducer = createAsyncReducer({
  initialState: INITIAL_STATE,
  action: FETCH_SOURCE_METADATA,
  handleSuccess: payload => ({
    list: payload.results,
  }),
});

export default createSourceReducer;
