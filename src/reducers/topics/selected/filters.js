import { TOPIC_FILTER_BY_SNAPSHOT, TOPIC_FILTER_BY_TIMESPAN } from '../../../actions/topicActions';

const INITIAL_STATE = {
  snapshotId: null,
  timespanId: null,
};

function info(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TOPIC_FILTER_BY_SNAPSHOT:
      return Object.assign({}, state, {
        ...state,
        snapshotId: parseInt(action.payload, 10),
      });
    case TOPIC_FILTER_BY_TIMESPAN:
      return Object.assign({}, state, {
        ...state,
        timespanId: parseInt(action.payload, 10),
      });
    default:
      return state;
  }
}

export default info;
