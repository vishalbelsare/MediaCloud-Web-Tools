import { combineReducers } from 'redux';
import selected from './selected/selected';
import all from './all';
import form from './form/form';
import favorited from './favorited';
import featured from './featured';

const collections = combineReducers({
  all,
  selected,
  form,
  favorited,
  featured,
});

export default collections;
