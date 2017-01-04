import { combineReducers } from 'redux';
import simple from './simple/simple';
import advanced from './advanced/advanced';

const search = combineReducers({
  simple,
  advanced,
});

export default search;
