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

      // syncing-wise replacing the whole object is tricky esp w/r sources, collections and the async retrieval of those names, descriptions
      if (action.payload.fieldName) {
        updatedState[action.payload.fieldName] = action.payload.query[action.payload.fieldName];
      }
      if (action.payload.query.collections && action.payload.query.sources) {
        updatedState.media = [].concat(action.payload.query.collections).concat(action.payload.query.sources);
      }
      // so we prep for the mediaPicker implementation
      return updatedState;
    case RESET_SELECTED:
      return INITIAL_STATE;
    default:
      return state;
  }
}
export default selected;
