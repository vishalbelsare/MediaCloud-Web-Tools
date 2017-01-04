import { combineReducers } from 'redux';
import allCollections from './allCollections';
import selected from './selected/selected';
import sourceSearchByIds from './sourceSearchByIds';
import collectionSearchByIds from './collectionSearchByIds';
import search from './search/search';

const rootReducer = combineReducers({
  allCollections,
  sourceSearchByIds,
  collectionSearchByIds,
  selected,
  search,
});

export default rootReducer;
