import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingAttention from './matchingAttention';
import matchingStoryCounts from './matchingStoryCounts';
import retweetCoverage from './retweetCoverage';
import retweetStoryCounts from './retweetStoryCounts';
import topCountriesCoverage from './topCountriesCoverage';
import topCountriesStoryCounts from './topCountriesStoryCounts';
import workflow from './workflow';

const createFocusReducer = combineReducers({
  matchingStories,
  matchingAttention,
  matchingStoryCounts,
  retweetCoverage,
  retweetStoryCounts,
  topCountriesCoverage,
  topCountriesStoryCounts,
  workflow,
});

export default createFocusReducer;
