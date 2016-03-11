import { LOGIN, LOGOUT } from './actions';
import { handleActions } from 'redux-actions';

const user = handleActions({
  LOGIN: (state, action) => ({
    ...action.payload,
    'isLoggedIn': true
  }),
  LOGOUT: (state, action) => ({
    'isLoggedIn': false
  })
}, { 'isLoggedIn': false });

export default user;