import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import workflow from './workflow';

const createFocusReducer = combineReducers({
  matchingStories,
  workflow,
});

export default createFocusReducer;
