import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingAttention from './matchingAttention';
import matchingStoryCounts from './matchingStoryCounts';
import workflow from './workflow';

const createFocusReducer = combineReducers({
  matchingStories,
  matchingAttention,
  matchingStoryCounts,
  workflow,
});

export default createFocusReducer;
