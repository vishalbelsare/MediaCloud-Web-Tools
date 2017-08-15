import { SELECT_MEDIA, CLEAR_SELECTED_MEDIA } from '../../../actions/systemActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

// we may not need this...

const INITIAL_STATE = {
  list: [],
};

function selectMedia(state = INITIAL_STATE, action) {
  let updatedSelectedList = [];
  switch (action.type) {
    case SELECT_MEDIA:
      updatedSelectedList = [...state.list];
      if (!updatedSelectedList.some(s => s.id === action.payload.id)) { // don't add duplicates
        updatedSelectedList.push(action.payload);
      }
      return { list: updatedSelectedList };
    case CLEAR_SELECTED_MEDIA: // maybe we want this...
      // removed from selected list
      updatedSelectedList = [];
      return { list: updatedSelectedList };
    default:
      return state;
  }
}

export default selectMedia;
