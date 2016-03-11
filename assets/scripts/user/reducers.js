import { LOGIN, LOGOUT, LOGGED_OUT_USER_STATE } from './actions';

function user(state = LOGGED_OUT_USER_STATE, action) {
  switch (action.type) {
  case LOGIN:
    return action.user;
  case LOGOUT:
    return LOGGED_OUT_USER_STATE;
  default:
    return state;
  }
}

export default user;