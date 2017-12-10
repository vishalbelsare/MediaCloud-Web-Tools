import { SELECT_MEDIAPICKER_QUERY_ARGS, RESET_MEDIAPICKER_QUERY_ARGS } from '../../../actions/systemActions';
import { PICK_COUNTRY } from '../../../lib/explorerUtil';

const INITIAL_STATE = { args: { type: PICK_COUNTRY, mediaKeyword: null } };

function selectMediaQuery(state = INITIAL_STATE, action) {
  const updatedState = null;
  switch (action.type) {
    case SELECT_MEDIAPICKER_QUERY_ARGS:
      if (action.payload) { // format should be args: { type:, mediaKeyword}
        const args = action.payload;
        return { args };
      }
      return updatedState;
    case RESET_MEDIAPICKER_QUERY_ARGS:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default selectMediaQuery;
