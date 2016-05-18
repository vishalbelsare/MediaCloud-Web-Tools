import { CONTROVERSY_FILTER_BY_SNAPSHOT } from '../../../actions/controversyActions';

const INITIAL_STATE = {
  snapshotId: null,
};

function info(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CONTROVERSY_FILTER_BY_SNAPSHOT:
      return Object.assign({}, state, {
        ...state,
        snapshotId: parseInt(action.payload.id, 10),
      });
    default:
      return state;
  }
}

export default info;
