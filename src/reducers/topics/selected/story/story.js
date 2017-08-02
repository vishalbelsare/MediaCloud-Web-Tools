import { combineReducers } from 'redux';
import info from './info';
import words from './words';
import inlinks from './inlinks';
import outlinks from './outlinks';
import entities from './entities';

const storyReducer = combineReducers({
  info,
  words,
  inlinks,
  outlinks,
  entities,
});

export default storyReducer;
