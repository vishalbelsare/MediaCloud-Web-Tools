import { resolve, reject } from 'redux-simple-promise';
import { LOGIN_WITH_PASSWORD, LOGIN_WITH_KEY, LOGOUT } from '../actions/userActions';
import { saveCookies, deleteCookies } from '../lib/auth';
import * as fetchConstants from '../lib/fetchConstants.js';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
  isLoggedIn: false,
  key: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {

    case LOGIN_WITH_PASSWORD:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
        isLoggedIn: false,
        ...action.payload,
      });
    case resolve(LOGIN_WITH_PASSWORD):
      saveCookies(action.payload.email, action.payload.key);
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        isLoggedIn: true,
        ...action.payload,
      });
    case reject(LOGIN_WITH_PASSWORD):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
        isLoggedIn: false,
      });

    case LOGIN_WITH_KEY:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
        isLoggedIn: false,
        ...action.payload,
      });
    case resolve(LOGIN_WITH_KEY):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        isLoggedIn: true,
        ...action.payload,
      });
    case reject(LOGIN_WITH_KEY):
      deleteCookies();
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
        isLoggedIn: false,
        key: null,
      });
    case LOGOUT:
      deleteCookies();
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_INVALID,
        isLoggedIn: false,
        key: null,
      });

    default:
      return state;
  }
}
