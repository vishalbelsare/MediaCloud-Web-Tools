import { combineReducers } from 'redux';
import { SELECT, SELECT_ADVANCED_SEARCH_STRING } from '../../../actions/sourceActions';
import details from './details/details';
import sourceInfo from './sourceInfo';
import collectionInfo from './collectionInfo';
import sourcesByMetadata from './sourcesByMetadata';
import collectionsByMetadata from './collectionsByMetadata';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT:
      return parseInt(action.payload.id, 10);
    default:
      return state;
  }
}

function advancedSearchString(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_ADVANCED_SEARCH_STRING:
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  id,
  sourceInfo,
  collectionInfo,
  details,
  advancedSearchString,
  sourcesByMetadata,
  collectionsByMetadata,
});

export default rootReducer;
