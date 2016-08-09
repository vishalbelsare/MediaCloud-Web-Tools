import { combineReducers } from 'redux';
import info from './info';
import sentenceCount from './sentenceCount';
import stories from './stories';
import inlinks from './inlinks';
import outlinks from './outlinks';
import words from './words';

const mediaSourceReducer = combineReducers({
  info,
  sentenceCount,
  stories,
  inlinks,
  outlinks,
  words,
});

export default mediaSourceReducer;
