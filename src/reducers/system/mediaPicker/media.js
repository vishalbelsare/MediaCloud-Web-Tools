import { combineReducers } from 'redux';
import selectMediaQuery from './selectMediaQuery';
import collectionQueryResults from './collectionQueryResults';
import countryCollectionQueryResults from './countryCollectionQueryResults';
import sourceQueryResults from './sourceQueryResults';
import featured from './featured';
import selectMedia from './selectMedia';
import favoritedCollections from './favoritedCollections';
import favoritedSources from './favoritedSources';

const media = combineReducers({
  selectMediaQuery,
  collectionQueryResults,
  countryCollectionQueryResults,
  sourceQueryResults,
  featured,
  selectMedia,
  favoritedCollections,
  favoritedSources,
});

export default media;
