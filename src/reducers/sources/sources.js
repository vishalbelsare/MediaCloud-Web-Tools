import { combineReducers } from 'redux';
import allCollections from './allCollections';
import allSources from './allSources';
import selected from './selected/selected';
import sourceSearch from './sourceSearch';

const rootReducer = combineReducers({
  allCollections,
  allSources,
  sourceSearch,
  selected,
});

export default rootReducer;
