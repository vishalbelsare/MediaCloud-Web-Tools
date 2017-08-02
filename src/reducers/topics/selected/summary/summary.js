import { combineReducers } from 'redux';
import topStories from './topStories';
import topMedia from './topMedia';
import topWords from './topWords';
import sentenceCount from './sentenceCount';
import storyTotals from './storyTotals';
import geocodedStoryTotals from './geocodedStoryTotals';
import englishStoryTotals from './englishStoryTotals';
import mapFiles from './mapFiles';

const summaryReducer = combineReducers({
  topStories,
  topMedia,
  topWords,
  sentenceCount,
  storyTotals,
  geocodedStoryTotals,
  englishStoryTotals,
  mapFiles,
});

export default summaryReducer;
