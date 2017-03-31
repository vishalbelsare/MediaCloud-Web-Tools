import { combineReducers } from 'redux';
import seedCollections from './seedCollections';
import seedSources from './seedSources';
import toCopy from './toCopy';
import toUpload from './toUpload';
import urlsToAdd from './urlsToAdd';

const form = combineReducers({
  seedCollections,
  seedSources,
  toCopy,
  toUpload,
  urlsToAdd,
});

export default form;
