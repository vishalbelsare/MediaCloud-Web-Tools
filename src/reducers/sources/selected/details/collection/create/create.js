import { combineReducers } from 'redux';
import attachedSources from './attachedSources';
import properties from './properties';
import sourceSearch from './sourceSearch';

const createCollectionReducer = combineReducers({
  attachedSources,
  properties,
  sourceSearch,
});

export default createCollectionReducer;
