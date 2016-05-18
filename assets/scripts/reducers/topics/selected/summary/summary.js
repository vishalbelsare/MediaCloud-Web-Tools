import { combineReducers } from 'redux';
import info from './info';
import topStories from './topStories';
import topMedia from './topMedia';
import topWords from './topWords';

const summaryReducer = combineReducers({
  info,
  topStories,
  topMedia,
  topWords,
});

export default summaryReducer;
