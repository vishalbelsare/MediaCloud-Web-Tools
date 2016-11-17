import { combineReducers } from 'redux';
import sourceDetailsReducer from './sourceDetailsReducer';
import collectionDetailsReducer from './collectionDetailsReducer';
import create from './collection/create/create';


const details = combineReducers({
  sourceDetailsReducer,
  collectionDetailsReducer,
  create,
});

export default details;
