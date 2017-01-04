import { combineReducers } from 'redux';
import selected from './selected/selected';

const sources = combineReducers({
  selected,
});

export default sources;
