import { SET_NEW_COLLECTION } from '../../../../../../actions/sourceActions';
import { createReducer } from '../../../../../../lib/reduxHelpers';

export const INITIAL_STATE = {
  name: null,
  description: null,
  static: null,
};

const createCollectionReducer = createReducer({
  initialState: INITIAL_STATE,
  [SET_NEW_COLLECTION]: payload => ({ ...payload }),
});

export default createCollectionReducer;
