import { combineReducers } from 'redux';
import list from './list';
import create from './create';

const focalSetsReducer = combineReducers({
  list,
  create,
});

export default focalSetsReducer;
