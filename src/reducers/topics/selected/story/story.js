import { combineReducers } from 'redux';
import info from './info';
import words from './words';
import inlinks from './inlinks';
import outlinks from './outlinks';

const storyReducer = combineReducers({
  info,
  words,
  inlinks,
  outlinks,
});

export default storyReducer;
