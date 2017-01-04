import { combineReducers } from 'redux';
import collections from './collections';
import sources from './sources';

const advanced = combineReducers({
  collections,
  sources,
});

export default advanced;
