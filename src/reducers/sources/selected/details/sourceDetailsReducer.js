import { combineReducers } from 'redux';
import sourceDetails from './sourceDetails';

import topWords from './topWords';
import sentenceCount from './sentenceCount';

const sourceDetailsReducer = combineReducers({
  sourceDetails,
  topWords,
  sentenceCount,
});

export default sourceDetailsReducer;
