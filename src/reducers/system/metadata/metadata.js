import { combineReducers } from 'redux';
import publicationCountry from './publicationCountry';
import publicationState from './publicationState';
import primaryLanguage from './primaryLanguage';

const metadata = combineReducers({
  publicationCountry,
  publicationState,
  primaryLanguage,
});

export default metadata;
