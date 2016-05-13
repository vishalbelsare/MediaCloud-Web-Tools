import { combineReducers } from 'redux';
import summary from './summary';
import topStories from './topStories';
import topMedia from './topMedia';
import topWords from './topWords';

const rootReducer = combineReducers({
  summary,
  topStories,
  topMedia,
  topWords,
});

export default rootReducer;
