import { combineReducers } from 'redux';
import list from './list';
import definitions from './definitions';
import create from './create/create';

const focalSetsReducer = combineReducers({
  list,
  create,
  definitions,
});

export default focalSetsReducer;
