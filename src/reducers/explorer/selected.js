import { SELECT_QUERY, UPDATE_QUERY, RESET_SELECTED } from '../../actions/explorerActions';

const INITIAL_STATE = null;

function selected(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_QUERY:
      return action.payload ? { ...action.payload } : null;
    case UPDATE_QUERY:
      const updatedState = action.payload;
      updatedState.media = action.payload.collections.concat(action.payload.sources);
      return updatedState;
    case RESET_SELECTED:
      return INITIAL_STATE;
    default:
      return state;
  }
}
export default selected;
