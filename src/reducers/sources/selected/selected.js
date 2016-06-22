import { combineReducers } from 'redux';
import { SELECT_SOURCE } from '../../../actions/sourceActions';
import details from './details/details';
import sourceInfo from './sourceInfo';
import collectionInfo from './collectionInfo';
const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_SOURCE:
      return parseInt(action.payload.id, 10);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  id,
  sourceInfo,
  collectionInfo,
  details,
});

export default rootReducer;
