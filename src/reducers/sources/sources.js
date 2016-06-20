import { combineReducers } from 'redux';
import allcollections from './allcollections';
import allsources from './allsources';
import selected from './selected/selected';
import sourceSearch from './sourceSearch';

const rootReducer = combineReducers({
  allcollections,
  allsources,
  sourceSearch,
  selected,
});

export default rootReducer;
