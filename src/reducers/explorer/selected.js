import { SELECT_QUERY, UPDATE_QUERY, RESET_SELECTED } from '../../actions/explorerActions';

const INITIAL_STATE = null;

function selected(state = INITIAL_STATE, action) {
  let updatedState = {};
  switch (action.type) {
    case SELECT_QUERY:
      return action.payload ? { ...action.payload } : null;
    case UPDATE_QUERY:
      updatedState = state; // could be null
      if (updatedState == null) {
        updatedState = action.payload;
      }
      updatedState.media = [].concat(action.payload.collections).concat(action.payload.sources);
      // so we prep for the mediaPicker implementation
      return updatedState;
    case RESET_SELECTED:
      return INITIAL_STATE;
    default:
      return state;
  }
}
export default selected;
