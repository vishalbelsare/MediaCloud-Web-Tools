import { combineReducers } from 'redux';
import list from './list';
import definitions from './definitions';
import create from './create/create';
import foci from './foci';

const focalSetsReducer = combineReducers({
  list,
  create,
  definitions,
  foci,
});

export default focalSetsReducer;
