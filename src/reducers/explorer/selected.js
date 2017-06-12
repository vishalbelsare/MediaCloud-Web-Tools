import { SELECT_QUERY } from '../../actions/explorerActions';

const INITIAL_STATE = null;

function selected(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_QUERY:
      return action.payload ? { ...action.payload, q: action.payload.q } : null;
    default:
      return state;
  }
}
export default selected;
