import { combineReducers } from 'redux';
import sourceDetailsReducer from './sourceDetailsReducer';
import collectionDetailsReducer from './collectionDetailsReducer';
import collectionCreate from './collection/create/create';
import sourceCreate from './mediasource/create/create';


const details = combineReducers({
  sourceDetailsReducer,
  collectionDetailsReducer,
  collectionCreate,
  sourceCreate,
});

export default details;
