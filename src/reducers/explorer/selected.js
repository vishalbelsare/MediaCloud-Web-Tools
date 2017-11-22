import { SELECT_QUERY, UPDATE_QUERY, RESET_SELECTED } from '../../actions/explorerActions';

const INITIAL_STATE = null;

function selected(state = INITIAL_STATE, action) {
  let updatedState = {};
  switch (action.type) {
    case SELECT_QUERY:
      updatedState = state;
      if (updatedState == null) {
        return action.payload;
      }
      return action.payload ? { ...action.payload } : null;
    case UPDATE_QUERY:
      updatedState = state; // could be null
      if (updatedState == null) {
        updatedState = action.payload;
      }
      // syncing-wise replacing the whole object is tricky esp w/r sources, collections and the async retrieval of those names, descriptions
      // so we dont' do a wholesale copy but rather per field
      if (action.payload.fieldName) {
        updatedState[action.payload.fieldName] = action.payload.query[action.payload.fieldName];
        updatedState.autoNaming = action.payload.query.autoNaming;
      }
      if (action.payload.query.collections && action.payload.query.sources) { // aggregate media for selected media tray/picker TODO maybe retire now that we ensure we have the media
        updatedState.media = [].concat(action.payload.query.collections).concat(action.payload.query.sources);
      }
      return updatedState;
    case RESET_SELECTED:
      return INITIAL_STATE;
    default:
      return state;
  }
}
export default selected;
