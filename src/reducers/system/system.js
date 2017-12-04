import { combineReducers } from 'redux';
import stats from './stats';
import metadata from './metadata/metadata';
import mediaPicker from './mediaPicker/media';
import topEntitiesPeople from './topEntitiesPeople';
import topEntitiesOrgs from './topEntitiesOrgs';

const system = combineReducers({
  stats,
  metadata,
  mediaPicker,
  topEntitiesPeople,
  topEntitiesOrgs,
});

export default system;
