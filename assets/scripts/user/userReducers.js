import { resolve, reject } from 'redux-simple-promise';
import { LOGIN, LOGOUT, LOGIN_FROM_COOKIE} from './userActions';
import { handleActions } from 'redux-actions';
import cookie from 'react-cookie';
import { COOKIE_USERNAME, COOKIE_KEY } from '../lib/auth'

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
    cookie.save(COOKIE_KEY,action.payload.key);
    cookie.save(COOKIE_USERNAME,action.payload.email);
  case LOGIN_FROM_COOKIE:
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
    cookie.remove(COOKIE_KEY);
    cookie.remove(COOKIE_USERNAME);
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: false,
      key: null
    });
  default:
    return state;
  }
}
