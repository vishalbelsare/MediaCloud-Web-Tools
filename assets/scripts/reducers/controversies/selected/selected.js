import { combineReducers } from 'redux';
import summary from './summary';
import topStories from './topStories';

const rootReducer = combineReducers({
  summary,
  topStories,
});

export default rootReducer;
