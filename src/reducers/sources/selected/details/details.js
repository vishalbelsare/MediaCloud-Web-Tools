import { combineReducers } from 'redux';
import collection from './collection/collection';

const details = combineReducers({
  collection,
});

export default details;
