import { SET_BRAND_MASTHEAD_TEXT, UPDATE_FEEDBACK } from '../actions/appActions';

const INITIAL_STATE = {
  mastheadText: null,
  feedback: {
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

    case UPDATE_FEEDBACK:
      return Object.assign({}, state, {
        feedback: action.payload,
      });

    default:
      return state;
  }
}
