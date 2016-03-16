import { resolve, reject } from 'redux-simple-promise';
import { LOGIN, LOGOUT} from './userActions';
import { handleActions } from 'redux-actions';

const INITIAL_STATE = {
  isFetching: false,
  isLoggedIn: false,
  key: null
};

function user(state = INITIAL_STATE, action) {
  switch(action.type){
  case LOGIN:
    return Object.assign({},state, {
      isFetching: true,
      ...action.payload
    });
  case resolve(LOGIN):
    console.log(action);
    return Object.assign({}, state, {
      isFetching: false,
      ...action.payload,
      isLoggedIn: true
    });
  case reject(LOGIN):
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: false
    });
  case LOGOUT:
    return Object.assign({}, state, {
      isFetching: false,
      isLoggedIn: false,
      key: null
    });
  default:
    return state;
  }
}
