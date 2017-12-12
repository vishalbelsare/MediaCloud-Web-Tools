import { combineReducers } from 'redux';
import selectMediaQuery from './selectMediaQuery';
import collectionQueryResults from './collectionQueryResults';
import countryCollectionQueryResults from './countryCollectionQueryResults';
import sourceQueryResults from './sourceQueryResults';
import featured from './featured';
import selectMedia from './selectMedia';

const media = combineReducers({
  selectMediaQuery,
  collectionQueryResults,
  countryCollectionQueryResults,
  sourceQueryResults,
  featured,
  selectMedia,
});

export default media;
