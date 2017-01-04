import { combineReducers } from 'redux';
import collections from './collections';
import sources from './sources';

const simple = combineReducers({
  collections,
  sources,
});

export default simple;
