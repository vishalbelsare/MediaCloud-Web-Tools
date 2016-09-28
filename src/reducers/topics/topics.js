import { combineReducers } from 'redux';
import all from './all';
import favorite from './favorite';
import selected from './selected/selected';

const rootReducer = combineReducers({
  all,
  favorite,
  selected,
});

export default rootReducer;
