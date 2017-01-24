import { combineReducers } from 'redux';
import selected from './selected/selected';
import suggestions from './suggestions';
import favorited from './favorited';

const sources = combineReducers({
  selected,
  suggestions,
  favorited,
});

export default sources;
