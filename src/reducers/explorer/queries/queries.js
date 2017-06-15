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
      if (action.payload) {
        const updatedState = state;
        let modifiedQuery = state.filter(q => q.id === action.payload.id)[0];
        modifiedQuery = Object.assign({}, modifiedQuery, action.payload);
        updatedState[action.payload.id] = modifiedQuery;
        return updatedState;
      }
      return null;
    default:
      return state;
  }
}

const queries = combineReducers({
  sentenceCount,
  list,
});

export default queries;
