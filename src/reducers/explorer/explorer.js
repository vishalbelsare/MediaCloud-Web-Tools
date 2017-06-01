import { combineReducers } from 'redux';
import selected from './selected';
import queries from './queries';

const rootReducer = combineReducers({
  selected,
  queries,
});

export default rootReducer;
