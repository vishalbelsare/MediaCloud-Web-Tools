import { combineReducers } from 'redux';
import info from './info';
import words from './words';
import stories from './stories';
import sentenceCount from './sentenceCount';

const wordReducer = combineReducers({
  info,
  words,
  stories,
  sentenceCount,
});

export default wordReducer;
