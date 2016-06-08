import { combineReducers } from 'redux';
import sourceDetails from './sourceDetails';
import collectionDetails from './collectionDetails';
// import topWords from './topWords';
// import sentenceCount from './sentenceCount';

const summaryReducer = combineReducers({
  sourceDetails,
  collectionDetails,
 // topWords,
 // sentenceCount,
});

export default summaryReducer;
