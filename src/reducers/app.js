import { SET_BRAND_MASTHEAD_TEXT, UPDATE_SNACK_BAR } from '../actions/appActions';

const INITIAL_STATE = {
  mastheadText: null,
  snackBar: {
    open: false,
    message: '',
  },
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {

    case SET_BRAND_MASTHEAD_TEXT:
      return Object.assign({}, state, {
        mastheadText: action.payload,
      });

    case UPDATE_SNACK_BAR:
      return Object.assign({}, state, {
        snackBar: action.payload,
      });

    default:
      return state;
  }
}
