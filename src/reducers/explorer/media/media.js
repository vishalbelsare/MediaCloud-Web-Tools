import { combineReducers } from 'redux';
import selectMediaQuery from './selectMediaQuery';
import collectionQueryResults from './collectionQueryResults';
import featured from './featured';

const advanced = combineReducers({
  selectMediaQuery,
  collectionQueryResults,
  featured,
});

export default advanced;
