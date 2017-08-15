import { combineReducers } from 'redux';
import sources from './sources';
import collections from './collections';
import queries from './queries';

const queriesH = combineReducers({
  queries,
  sources,
  collections,
});

export default queriesH;
