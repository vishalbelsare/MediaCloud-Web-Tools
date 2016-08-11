import { combineReducers } from 'redux';
import list from './list';
import create from './create/create';

const focalSetsReducer = combineReducers({
  list,
  create,
});

export default focalSetsReducer;
