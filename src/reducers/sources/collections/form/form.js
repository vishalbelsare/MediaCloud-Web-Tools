import { combineReducers } from 'redux';
import seedCollections from './seedCollections';
import seedSources from './seedSources';
import toCopy from './toCopy';
import toUpload from './toUpload';

const form = combineReducers({
  seedCollections,
  seedSources,
  toCopy,
  toUpload,
});

export default form;
