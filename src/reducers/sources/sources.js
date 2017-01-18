import { combineReducers } from 'redux';
import systemStats from './systemStats';
import search from './search/search';
import collections from './collections/collections';
import sources from './sources/sources';

const rootReducer = combineReducers({
  systemStats,
  search,
  collections,
  sources,
});

export default rootReducer;
