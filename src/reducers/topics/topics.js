import { combineReducers } from 'redux';
import personalList from './personalList';
import favoriteList from './favoriteList';
import adminList from './adminList';
import selected from './selected/selected';
import search from './search';
import create from './create/create';

const rootReducer = combineReducers({
  selected,
  favoriteList,
  personalList,
  adminList,
  search,
  create,
});

export default rootReducer;
