import { combineReducers } from 'redux';
import info from './info';
import splitStoryCount from './splitStoryCount';
import stories from './stories';
import inlinks from './inlinks';
import outlinks from './outlinks';
import words from './words';

const mediaSourceReducer = combineReducers({
  info,
  splitStoryCount,
  stories,
  inlinks,
  outlinks,
  words,
});

export default mediaSourceReducer;
