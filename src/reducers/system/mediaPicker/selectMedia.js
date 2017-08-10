import { SELECT_MEDIA, UNSELECT_MEDIA } from '../../../actions/systemActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

// we may not need this...

const INITIAL_STATE = null;

function selectMedia(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_MEDIA:
      // add to selected list
      break;
    case UNSELECT_MEDIA: // maybe we want this...
      // removed from selected list
      break;
    default:
      return state;
  }
  return state;
}

export default selectMedia;
