import { combineReducers } from 'redux';
import allcollections from './allcollections';
import allsources from './allsources';
import selected from './selected/selected';

const rootReducer = combineReducers({
  allcollections,
  allsources,
  selected,
});

export default rootReducer;
