import { createReducer } from '../../lib/reduxHelpers';
import { UPDATE_TIMESTAMP_FOR_QUERIES } from '../../actions/explorerActions';

const INITIAL_STATE = {
  time: 0,
};

const lastSearchTime = createReducer({
  initialState: INITIAL_STATE,
  [UPDATE_TIMESTAMP_FOR_QUERIES]: () => ({ time: Date.now() }),
});
export default lastSearchTime;
