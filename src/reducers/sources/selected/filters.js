import { SOURCE_FILTER_BY_SNAPSHOT, SOURCE_FILTER_BY_TIMESPAN } from '../../../actions/sourceActions';

const INITIAL_STATE = {
  snapshotId: null,
  timespanId: null,
};

function info(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SOURCE_FILTER_BY_SNAPSHOT:
      return Object.assign({}, state, {
        ...state,
        snapshotId: parseInt(action.payload.id, 10),
      });
    case SOURCE_FILTER_BY_TIMESPAN:
      return Object.assign({}, state, {
        ...state,
        timespanId: parseInt(action.payload.id, 10),
      });
    default:
      return state;
  }
}

export default info;
