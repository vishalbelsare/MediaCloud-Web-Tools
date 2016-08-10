import { SET_BRAND_MASTHEAD_TEXT } from '../actions/brandActions';

const INITIAL_STATE = {
  mastheadText: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {

    case SET_BRAND_MASTHEAD_TEXT:
      return Object.assign({}, state, {
        mastheadText: action.payload,
      });

    default:
      return state;
  }
}
