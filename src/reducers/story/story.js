import { combineReducers } from 'redux';
import entities from './entities';
import nytThemes from './nytThemes';
import info from './info';

const rootReducer = combineReducers({
  entities,
  nytThemes,
  info,
});

export default rootReducer;
