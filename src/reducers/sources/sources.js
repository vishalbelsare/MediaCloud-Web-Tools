import { combineReducers } from 'redux';
import allCollections from './allCollections';
import allSources from './allSources';
import selected from './selected/selected';
import sourceSearch from './sourceSearch';
import collectionSearch from './collectionSearch';

const rootReducer = combineReducers({
  allCollections,
  allSources,
  sourceSearch,
  collectionSearch,
  selected,
});

export default rootReducer;
