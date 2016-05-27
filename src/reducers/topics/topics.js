import { combineReducers } from 'redux';
import all from './all';
import selected from './selected/selected';

const rootReducer = combineReducers({
  all,
  selected,
});

export default rootReducer;
