import { combineReducers } from 'redux';
import search from './search/search';
import collections from './collections/collections';
import sources from './sources/sources';

const rootReducer = combineReducers({
  search,
  collections,
  sources,
});

export default rootReducer;
