import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import workflow from './workflow';
import properties from './properties';

const createFocusReducer = combineReducers({
  matchingStories,
  workflow,
  properties,
});

export default createFocusReducer;
