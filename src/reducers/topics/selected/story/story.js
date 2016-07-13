import { combineReducers } from 'redux';
import info from './info';
import words from './words';

const storyReducer = combineReducers({
  info,
  words,
});

export default storyReducer;
