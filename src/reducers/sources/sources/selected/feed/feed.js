import { combineReducers } from 'redux';
import info from './info';
import feeds from './feeds';

const feedReducer = combineReducers({
  info,
  feeds,
});

export default feedReducer;
