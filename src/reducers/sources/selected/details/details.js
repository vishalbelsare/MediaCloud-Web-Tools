import { combineReducers } from 'redux';
import sourceDetailsReducer from './sourceDetailsReducer';
import collectionDetailsReducer from './collectionDetailsReducer';


const details = combineReducers({
  sourceDetailsReducer,
  collectionDetailsReducer,
});

export default details;
