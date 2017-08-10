import { SELECT_MEDIA, UNSELECT_MEDIA } from '../../../actions/systemActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

const INITIAL_STATE = null;

function selectMediaQuery(state = INITIAL_STATE, action) {
  const updatedState = null;
  switch (action.type) {
    case SELECT_MEDIA:
      if (action.payload) {
        const updatedObj = Object.assign({}, state, { selected: true });
        return { updatedObj };
      }
      return updatedState;
    case UNSELECT_MEDIA: // maybe we want this...
      if (action.payload) {
        const updatedObj = Object.assign({}, action.payload, { selected: false });
        return { updatedObj };
      }
      return updatedState;
    default:
      return state;
  }
}

export default selectMediaQuery;
