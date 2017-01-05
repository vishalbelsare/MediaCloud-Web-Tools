import { combineReducers } from 'redux';
import seedCollections from './seedCollections';
import seedSources from './seedSources';
import toCopy from './toCopy';
import createOrUpdateSourcesByTemplate from './createOrUpdateSourcesByTemplate';

const form = combineReducers({
  seedCollections,
  seedSources,
  toCopy,
  createOrUpdateSourcesByTemplate,
});

export default form;
