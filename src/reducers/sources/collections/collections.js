import { combineReducers } from 'redux';
import selected from './selected/selected';
import all from './all';

const collections = combineReducers({
  all,
  selected,
});

export default collections;
