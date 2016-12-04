import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingAttention from './matchingAttention';
import workflow from './workflow';

const createFocusReducer = combineReducers({
  matchingStories,
  matchingAttention,
  workflow,
});

export default createFocusReducer;
