import { combineReducers } from 'redux';
import selected from './selected';
import queries from './queries/queries';
import lastSearchTime from './lastSearchTime';
import sentenceCount from './sentenceCount';
import samples from './samples';

const rootReducer = combineReducers({
  selected,
  queries,
  lastSearchTime,
  sentenceCount,
  samples,
});

export default rootReducer;
