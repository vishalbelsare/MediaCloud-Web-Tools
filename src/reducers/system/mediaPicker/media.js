import { combineReducers } from 'redux';
import selectMediaQuery from './selectMediaQuery';
import collectionQueryResults from './collectionQueryResults';
import sourceQueryResults from './sourceQueryResults';
import featured from './featured';
import selectMedia from './selectMedia';

const media = combineReducers({
  selectMediaQuery,
  collectionQueryResults,
  sourceQueryResults,
  featured,
  selectMedia,
});

export default media;
