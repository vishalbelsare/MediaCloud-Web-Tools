import { combineReducers } from 'redux';
import current from './current';

const rootReducer = combineReducers({
  current,
});

export default rootReducer;
