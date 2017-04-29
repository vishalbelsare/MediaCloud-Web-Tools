import { combineReducers } from 'redux';
import { SELECT_COLLECTION } from '../../../../actions/sourceActions';
import collectionDetails from './collectionDetails';
import collectionTopWords from './collectionTopWords';
import collectionSentenceCount from './collectionSentenceCount';
import collectionGeoTag from './collectionGeoTag';
import collectionSourceSentenceCounts from './collectionSourceSentenceCounts';
import collectionSimilar from './collectionSimilar';
import historicalSentenceCounts from './historicalSentenceCounts';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_COLLECTION:
      return action.payload ? parseInt(action.payload, 10) : null;
    default:
      return state;
  }
}

const selected = combineReducers({
  id,
  collectionDetails,
  collectionTopWords,
  collectionSentenceCount,
  collectionGeoTag,
  collectionSourceSentenceCounts,
  collectionSimilar,
  historicalSentenceCounts,
});

export default selected;
