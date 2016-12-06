import { combineReducers } from 'redux';
import allCollections from './allCollections';
import allSources from './allSources';
import selected from './selected/selected';
import sourceSearch from './sourceSearch';
import collectionSearch from './collectionSearch';
import sourceSearchByIds from './sourceSearchByIds';
import collectionSearchByIds from './collectionSearchByIds';

const rootReducer = combineReducers({
  allCollections,
  allSources,
  sourceSearch,
  collectionSearch,
  sourceSearchByIds,
  collectionSearchByIds,
  selected,
});

export default rootReducer;
