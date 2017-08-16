import { combineReducers } from 'redux';
import stats from './stats';
import metadata from './metadata/metadata';
import mediaPicker from './mediaPicker/media';

const system = combineReducers({
  stats,
  metadata,
  mediaPicker,
});

export default system;
