import { LOGIN, LOGOUT, REQUEST_LOGIN, ATTEMPT_LOGIN, RECEIVE_LOGIN } from './userActions';
import { handleActions } from 'redux-actions';

function user(state = {
  isFetching: false,
  isLoggedIn: false
}, action) {
  switch (action.type) {
    case LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false
      });
    case REQUEST_LOGIN:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case ATTEMPT_LOGIN:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_LOGIN:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        ...action.payload,
        isLoggedIn: true
      })
    default:
      return state;
  }
}
/*
const user = handleActions({
  LOGIN: (state, action) => ({
    ...action.payload,
    'isLoggedIn': true
  }),
  LOGOUT: (state, action) => ({
    'isLoggedIn': false
  }),
  'ATTEMPT_LOGIN': (state, action) => ({
      Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
  })
}, { isFetching: false, didInvalidate: false, 'isLoggedIn': false });
*/
export default user;