import { combineReducers } from 'redux';
import { SELECT_TOPIC } from '../../../actions/topicActions';
import snapshots from './snapshots';
import summary from './summary/summary';
import filters from './filters';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_TOPIC:
      return parseInt(action.payload.id, 10);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  id,
  summary,
  snapshots,
  filters,
});

export default rootReducer;
