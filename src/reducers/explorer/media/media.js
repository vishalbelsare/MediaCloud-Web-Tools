import { combineReducers } from 'redux';
import selectMediaQuery from './selectMediaQuery';
import collectionQueryResults from './collectionQueryResults';
import featured from './featured';

const media = combineReducers({
  selectMediaQuery,
  collectionQueryResults,
  featured,
});

export default media;
