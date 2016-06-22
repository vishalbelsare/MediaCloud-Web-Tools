import { combineReducers } from 'redux';
import collectionDetails from './collectionDetails';
//import collectionTopWords from './collectionTopWords';
//import collectionSentenceCount from './collectionSentenceCount';
// import topWords from './topWords';
// import sentenceCount from './sentenceCount';

const collectionDetailsReducer = combineReducers({
  collectionDetails,
  //collectionTopWords,
  //collectionSentenceCount,

});

export default collectionDetailsReducer;
