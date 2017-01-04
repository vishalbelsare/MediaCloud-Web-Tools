import { combineReducers } from 'redux';
import selected from './selected/selected';
import all from './all';
import form from './form/form';

const collections = combineReducers({
  all,
  selected,
  form,
});

export default collections;
