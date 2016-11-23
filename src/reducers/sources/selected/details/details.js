import { combineReducers } from 'redux';
import sourceDetailsReducer from './sourceDetailsReducer';
import collectionDetailsReducer from './collectionDetailsReducer';
import collectionCreate from './collection/create/create';

const details = combineReducers({
  sourceDetailsReducer,
  collectionDetailsReducer,
  collectionCreate,
});

export default details;
