import { MEDIA_PICKER_SELECT_MEDIA, MEDIA_PICKER_INITIALIZE_ALREADY_SELECTED_MEDIA, MEDIA_PICKER_CLEAR_SELECTED_MEDIA } from '../../../actions/systemActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

// we may not need this...

const INITIAL_STATE = {
  list: [],
};

function selectMedia(state = INITIAL_STATE, action) {
  let updatedSelectedList = [];
  switch (action.type) {
    case MEDIA_PICKER_INITIALIZE_ALREADY_SELECTED_MEDIA:
      updatedSelectedList = [...state.list];
      /* if (!updatedSelectedList.some(s => s.id === action.payload.id)) { // don't add duplicates
        const selectedObj = action.payload;
        selectedObj.selected = true; // set this now, one as a time? this is the init master list
        updatedSelectedList.push(selectedObj);
      } */
      updatedSelectedList = action.payload;
      updatedSelectedList = updatedSelectedList.map(c => ({ ...c, selected: true }));

      // what about if it isn't found? how is it removed? from init to selected
      return { list: updatedSelectedList };
    case MEDIA_PICKER_SELECT_MEDIA:
      updatedSelectedList = [...state.list];
      if (!updatedSelectedList.some(s => s.id === action.payload.id)) { // if not there, add
        const selectedObj = action.payload;
        selectedObj.selected = selectedObj.selected === undefined ? true : !selectedObj.selected;
        updatedSelectedList.push(selectedObj);
      } else { // if there, treat as a removal/toggle
        const mediaIndex = updatedSelectedList.findIndex(s => s.id === action.payload.id);
        // mediaObj.selected = !(mediaObj.selected);
        updatedSelectedList.splice(mediaIndex, 1); // in display check matches
      }
      return { list: updatedSelectedList };
    case MEDIA_PICKER_CLEAR_SELECTED_MEDIA: // maybe we want this...
      // removed from selected list
      updatedSelectedList = [];
      return { list: updatedSelectedList };
    default:
      return state;
  }
}

export default selectMedia;
