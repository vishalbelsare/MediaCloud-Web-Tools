import { combineReducers } from 'redux';
import all from './all';
import favorite from './favorite';
import publiclist from './publiclist';
import adminList from './adminList';
import selected from './selected/selected';
import search from './search';
import create from './create/create';

const rootReducer = combineReducers({
  all,
  favorite,
  selected,
  search,
  publiclist,
  adminList,
  create,
});

export default rootReducer;
