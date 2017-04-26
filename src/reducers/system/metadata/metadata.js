import { combineReducers } from 'redux';
import publicationCountry from './publicationCountry';
import publicationState from './publicationState';

const metadata = combineReducers({
  publicationCountry,
  publicationState,
});

export default metadata;
