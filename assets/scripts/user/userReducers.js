import { LOGIN_PENDING, LOGIN_SUCCEEDED, LOGIN_FAILED, LOGOUT} from './userActions';
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
    case LOGIN_PENDING:
      return Object.assign({}, state, {
        isFetching: true,
        ...action.payload
      });
    case LOGIN_SUCCEEDED:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        ...action.payload,
        isLoggedIn: true
      });
    case LOGIN_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        isLoggedIn: false
      });
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