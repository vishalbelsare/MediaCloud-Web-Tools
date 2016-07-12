import { combineReducers } from 'redux';
import { SELECT_TOPIC } from '../../../actions/topicActions';
import snapshots from './snapshots';
import timespans from './timespans';
import summary from './summary/summary';
import filters from './filters';
import info from './info';
import media from './media';
import stories from './stories';
import story from './story';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_TOPIC:
      return parseInt(action.payload, 10);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  id,
  info,
  summary,
  snapshots,
  timespans,
  filters,
  media,
  stories,
  story,
});

export default rootReducer;
