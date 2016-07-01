import { combineReducers } from 'redux';
import sourceDetails from './sourceDetails';

import topWords from './topWords';
import sentenceCount from './sentenceCount';
// import geoTag from './geoTag';

const sourceDetailsReducer = combineReducers({
  sourceDetails,
  topWords,
  sentenceCount,
  // geoTag,
});

export default sourceDetailsReducer;
