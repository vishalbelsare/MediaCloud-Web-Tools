import { combineReducers } from 'redux';
import entities from './entities';
import nytThemes from './nytThemes';
import info from './info';
import inlinks from './inlinks';
import outlinks from './outlinks';
import words from './words';

const rootReducer = combineReducers({
  entities,
  nytThemes,
  info,
  inlinks,
  outlinks,
  words,
});

export default rootReducer;
