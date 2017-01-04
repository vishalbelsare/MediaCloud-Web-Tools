import { combineReducers } from 'redux';
import selected from './selected/selected';
import sourceSearchByIds from './sourceSearchByIds';
import collectionSearchByIds from './collectionSearchByIds';
import search from './search/search';
import collections from './collections/collections';
import sources from './sources/sources';

const rootReducer = combineReducers({
  sourceSearchByIds,
  collectionSearchByIds,
  selected,

  search,
  collections,
  sources,
});

export default rootReducer;
