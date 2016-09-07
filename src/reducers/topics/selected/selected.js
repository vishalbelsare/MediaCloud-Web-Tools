import { combineReducers } from 'redux';
import { SELECT_TOPIC, SET_TOPIC_NEEDS_NEW_SNAPSHOT } from '../../../actions/topicActions';
import snapshots from './snapshots';
import timespans from './timespans';
import summary from './summary/summary';
import filters from './filters';
import info from './info';
import media from './media';
import mediaSource from './mediaSource/mediaSource';
import stories from './stories';
import story from './story/story';
import focalSets from './focalSets/focalSets';
import permissions from './permissions';

function id(state = null, action) {
  switch (action.type) {
    case SELECT_TOPIC:
      return parseInt(action.payload, 10);
    default:
      return state;
  }
}

function needsNewSnapshot(state = false, action) {
  switch (action.type) {
    case SET_TOPIC_NEEDS_NEW_SNAPSHOT:
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  id,
  needsNewSnapshot,
  info,
  summary,
  snapshots,
  timespans,
  filters,
  media,
  mediaSource,
  stories,
  story,
  focalSets,
  permissions,
});

export default rootReducer;
