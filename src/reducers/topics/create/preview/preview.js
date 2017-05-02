import { combineReducers } from 'redux';
import matchingAttention from './matchingAttention';
import workflow from './workflow';

const createTopicReducer = combineReducers({
  workflow,
  matchingAttention,
});

export default createTopicReducer;
