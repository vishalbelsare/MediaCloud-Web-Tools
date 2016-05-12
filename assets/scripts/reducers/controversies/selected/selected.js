import { combineReducers } from 'redux';
import summary from './summary';
import topStories from './topStories';
import topMedia from './topMedia';

const rootReducer = combineReducers({
  summary,
  topStories,
  topMedia,
});

export default rootReducer;
