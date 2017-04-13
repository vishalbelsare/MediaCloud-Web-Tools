import { combineReducers } from 'redux';
import stats from './stats';
import metadata from './metadata/metadata';

const system = combineReducers({
  stats,
  metadata,
});

export default system;
