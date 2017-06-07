import { combineReducers } from 'redux';
// import { createReducer } from '../../../lib/reduxHelpers';
import { SET_QUERY_LIST } from '../../../actions/explorerActions';

import sentenceCount from './sentenceCount';

const INITIAL_STATE = null;

function list(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_QUERY_LIST:
      return action.payload ? action.payload : null;
    default:
      return state;
  }
}

const queries = combineReducers({
  sentenceCount,
  list,
});

export default queries;
