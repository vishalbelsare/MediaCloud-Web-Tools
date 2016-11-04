import { combineReducers } from 'redux';
import collectionDetails from './collectionDetails';
import collectionTopWords from './collectionTopWords';
import collectionSentenceCount from './collectionSentenceCount';
import collectionGeoTag from './collectionGeoTag';
import collectionSourceStoryCounts from './collectionSourceStoryCounts';
// import sentenceCount from './sentenceCount';

const collectionDetailsReducer = combineReducers({
  collectionDetails,
  collectionTopWords,
  collectionSentenceCount,
  collectionGeoTag,
  collectionSourceStoryCounts,
});

export default collectionDetailsReducer;
