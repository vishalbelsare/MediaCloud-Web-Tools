import { combineReducers } from 'redux';
import { SELECT_SOURCE } from '../../../../actions/sourceActions';
import sourceDetails from './sourceDetails';
import topWords from './topWords';
import sentenceCount from './sentenceCount';
import geoTag from './geoTag';
import feed from './feeds';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_SOURCE:
      return action.payload ? parseInt(action.payload.id, 10) : state;
    default:
      return state;
  }
}

const selected = combineReducers({
  id,
  sourceDetails,
  topWords,
  sentenceCount,
  geoTag,
  feed,
});

export default selected;
