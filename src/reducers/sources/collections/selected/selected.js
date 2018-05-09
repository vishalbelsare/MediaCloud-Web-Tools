import { combineReducers } from 'redux';
import { SELECT_COLLECTION } from '../../../../actions/sourceActions';
import collectionDetails from './collectionDetails';
import collectionTopWords from './collectionTopWords';
import collectionSplitStoryCount from './collectionSplitStoryCount';
import collectionGeoTag from './collectionGeoTag';
import collectionSourceSplitStoryCounts from './collectionSourceSplitStoryCounts';
import collectionSimilar from './collectionSimilar';
import historicalSentenceCounts from './historicalSentenceCounts';
import collectionSourceList from './collectionSourceList';

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
  collectionSplitStoryCount,
  collectionGeoTag,
  collectionSourceSplitStoryCounts,
  collectionSimilar,
  collectionSourceList,
  historicalSentenceCounts,
});

export default selected;
