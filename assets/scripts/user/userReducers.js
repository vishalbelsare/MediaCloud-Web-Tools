import { resolve, reject } from 'redux-simple-promise';
import { LOGIN, LOGOUT, LOGIN_FROM_EMAIL_AND_KEY} from './userActions';
import { handleActions } from 'redux-actions';
import { saveCookies, deleteCookies } from '../lib/auth'

const INITIAL_STATE = {
  isFetching: false,
  isLoggedIn: false,
  key: null
};

export default function user(state = INITIAL_STATE, action) {
  switch(action.type){
  case LOGIN:
    return Object.assign({},state, {
      isFetching: true,
      ...action.payload
    });
  case resolve(LOGIN):
    saveCookies(action.payload.email, action.payload.key);
  case LOGIN_FROM_EMAIL_AND_KEY:
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: true,
      ...action.payload
    });
  case reject(LOGIN):
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: false
    });
  case LOGOUT:
    deleteCookies();
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: false,
      key: null
    });
  default:
    return state;
  }
}
