import { combineReducers } from 'redux';
import all from './all';
import favorite from './favorite';
import publiclist from './publiclist';
import selected from './selected/selected';
import search from './search';

const rootReducer = combineReducers({
  all,
  favorite,
  selected,
  search,
  publiclist,
});

export default rootReducer;
