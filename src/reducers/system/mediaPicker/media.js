import { combineReducers } from 'redux';
import selectMediaQuery from './selectMediaQuery';
import collectionQueryResults from './collectionQueryResults';
import sourceQueryResults from './sourceQueryResults';
import featured from './featured';

const media = combineReducers({
  selectMediaQuery,
  collectionQueryResults,
  sourceQueryResults,
  featured,
});

export default media;
