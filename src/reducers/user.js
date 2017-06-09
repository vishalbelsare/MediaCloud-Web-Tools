import { resolve, reject } from 'redux-simple-promise';
import { LOGIN_WITH_PASSWORD, LOGIN_WITH_COOKIE, RESET_API_KEY } from '../actions/userActions';
import { saveCookies, deleteCookies } from '../lib/auth';
import * as fetchConstants from '../lib/fetchConstants';

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
      const passwordLoginWorked = (action.payload.status !== 500);
      if (passwordLoginWorked) {
        saveCookies(action.payload.email);
      } else {
        // for safety, delete any cookies that might be there
        deleteCookies();
      }
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        isLoggedIn: passwordLoginWorked,
        ...action.payload,
      });
    case reject(LOGIN_WITH_PASSWORD):
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
        isLoggedIn: false,
      });

    case LOGIN_WITH_COOKIE:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
        isLoggedIn: false,
        ...action.payload,
      });
    case resolve(LOGIN_WITH_COOKIE):
      const keyLoginWorked = (action.payload.status !== 401);
      if (!keyLoginWorked) {
        deleteCookies();
      }
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        isLoggedIn: keyLoginWorked,
        ...action.payload,
      });
    case reject(LOGIN_WITH_COOKIE):
      deleteCookies();
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
        isLoggedIn: false,
        key: null,
      });
    case resolve(RESET_API_KEY):
      return Object.assign({}, state, {
        key: action.payload.profile.api_key,
        profile: action.payload.profile,
      });
    default:
      return state;
  }
}
