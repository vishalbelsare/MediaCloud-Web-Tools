import { combineReducers } from 'redux';
import seedCollections from './seedCollections';
import seedSources from './seedSources';
import toCopy from './toCopy';

const form = combineReducers({
  seedCollections,
  seedSources,
  toCopy,
});

export default form;
