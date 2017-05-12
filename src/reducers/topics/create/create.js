import { combineReducers } from 'redux';
import preview from './preview/preview';

const createTopicReducer = combineReducers({
  preview,
});

export default createTopicReducer;
