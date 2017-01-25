import { combineReducers } from 'redux';
import all from './all';
import favorite from './favorite';
import selected from './selected/selected';
import full from './full';

const rootReducer = combineReducers({
  all,
  favorite,
  selected,
  full,
});

export default rootReducer;
