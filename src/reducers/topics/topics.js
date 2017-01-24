import { combineReducers } from 'redux';
import all from './all';
import favorite from './favorite';
import selected from './selected/selected';
import matching from './matching';

const rootReducer = combineReducers({
  all,
  favorite,
  selected,
  matching,
});

export default rootReducer;
