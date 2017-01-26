import { combineReducers } from 'redux';
import selected from './selected/selected';
import all from './all';
import form from './form/form';
import favorited from './favorited';
import featured from './featured';
import popular from './popular';

const collections = combineReducers({
  all,
  selected,
  form,
  favorited,
  featured,
  popular,
});

export default collections;
