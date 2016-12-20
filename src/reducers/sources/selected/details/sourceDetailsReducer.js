import { combineReducers } from 'redux';
import sourceDetails from './sourceDetails';

import topWords from './topWords';
import sentenceCount from './sentenceCount';
import geoTag from './geoTag';
import feed from './feeds';

const sourceDetailsReducer = combineReducers({
  sourceDetails,
  topWords,
  sentenceCount,
  geoTag,
  feed,
});

export default sourceDetailsReducer;
