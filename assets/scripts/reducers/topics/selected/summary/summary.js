import { combineReducers } from 'redux';
import topStories from './topStories';
import topMedia from './topMedia';
import topWords from './topWords';

const summaryReducer = combineReducers({
  topStories,
  topMedia,
  topWords,
});

export default summaryReducer;
