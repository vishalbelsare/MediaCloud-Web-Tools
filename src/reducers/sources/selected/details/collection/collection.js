import { combineReducers } from 'redux';
import create from './create/create';

const collection = combineReducers({
  create,
});

export default collection;
