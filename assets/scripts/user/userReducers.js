import { resolve, reject } from 'redux-simple-promise';
import { LOGIN_WITH_PASSWORD, LOGIN_WITH_KEY, LOGOUT} from './userActions';
import { handleActions } from 'redux-actions';
import { saveCookies, deleteCookies } from '../lib/auth'

const INITIAL_STATE = {
  isFetching: false,
  isLoggedIn: false,
  key: null
};

export default function user(state = INITIAL_STATE, action) {
  switch(action.type){

  case LOGIN_WITH_PASSWORD:
    return Object.assign({},state, {
      isFetching: true,
      isLoggedIn: false,
      ...action.payload
    });
  case resolve(LOGIN_WITH_PASSWORD):
    saveCookies(action.payload.email, action.payload.key);
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: true,
      ...action.payload
    });
  case reject(LOGIN_WITH_PASSWORD):
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: false
    });

  case LOGIN_WITH_KEY:
    return Object.assign({},state, {
      isFetching: true,
      isLoggedIn: false,
      ...action.payload
    });    
  case resolve(LOGIN_WITH_KEY):
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: true,
      ...action.payload
    });    
  case reject(LOGIN_WITH_KEY):

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
