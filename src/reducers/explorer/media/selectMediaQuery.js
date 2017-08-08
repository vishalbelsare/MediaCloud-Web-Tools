import { SELECT_MEDIA_QUERY_ARGS } from '../../../actions/explorerActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

const INITIAL_STATE = null;

function selectMediaQuery(state = INITIAL_STATE, action) {
  const updatedState = null;
  switch (action.type) {
    case SELECT_MEDIA_QUERY_ARGS:
      if (action.payload) { // searchId will not be present as this was a keyword search... index should be set on front end when parsing JSON keywords
        const type = action.payload.type;
        const arg = action.payload.keyword;
        return { type, arg };
      }
      return updatedState;
    default:
      return state;
  }
}

export default selectMediaQuery;
