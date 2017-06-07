import { combineReducers } from 'redux';
import sentenceCount from './sentenceCount';

const queryResults = combineReducers({
  sentenceCount,
});

export default queryResults;
