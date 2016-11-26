import { combineReducers } from 'redux';
import sourceDetailsReducer from './sourceDetailsReducer';
import collectionDetailsReducer from './collectionDetailsReducer';
import collection from './collection/collection';

const details = combineReducers({
  sourceDetailsReducer,
  collectionDetailsReducer,
  collection,
});

export default details;
