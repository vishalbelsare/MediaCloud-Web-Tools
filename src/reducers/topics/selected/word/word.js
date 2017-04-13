import { combineReducers } from 'redux';
import info from './info';
import words from './words';
import stories from './stories';
import sentenceCount from './sentenceCount';
import sampleSentences from './sampleSentences';

const wordReducer = combineReducers({
  info,
  words,
  stories,
  sentenceCount,
  sampleSentences,
});

export default wordReducer;
