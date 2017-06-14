import { combineReducers } from 'redux';
// import { createReducer } from '../../../lib/reduxHelpers';
import { FETCH_SAMPLE_SEARCHES, FETCH_SAVED_SEARCHES, UPDATE_QUERY } from '../../../actions/explorerActions';

import sentenceCount from './sentenceCount';

const INITIAL_STATE = null;


// TODO review with RB
function list(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SAMPLE_SEARCHES:
      return action.payload ? action.payload.args[0] : null;
    case FETCH_SAVED_SEARCHES:
      return action.payload ? action.payload.args[0] : null;
    case UPDATE_QUERY:
      return action.payload ? { ...state, ...action.payload } : null;
    default:
      return state;
  }
}

const queries = combineReducers({
  sentenceCount,
  list,
});

export default queries;
