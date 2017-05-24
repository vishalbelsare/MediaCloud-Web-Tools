import { combineReducers } from 'redux';
import publicationCountry from './publicationCountry';
import publicationState from './publicationState';
import primaryLanguage from './primaryLanguage';
import countryOfFocus from './countryOfFocus';

const metadata = combineReducers({
  publicationCountry,
  publicationState,
  primaryLanguage,
  countryOfFocus,
});

export default metadata;
