import { combineReducers } from 'redux';
import selected from './selected/selected';
import suggestions from './suggestions';

const sources = combineReducers({
  selected,
  suggestions,
});

export default sources;
