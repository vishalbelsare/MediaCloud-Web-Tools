import { combineReducers } from 'redux';
import properties from './properties';
import metadata from './metadata';
import countrylist from './countrylist';

const createSourceReducer = combineReducers({
  properties,
  metadata,
  countrylist,
});

export default createSourceReducer;
