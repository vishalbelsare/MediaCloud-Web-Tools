import { createAction } from 'redux-actions';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// takes one object arg - the user properties to store
export const login = createAction(LOGIN);

// no args
export const logout = createAction(LOGOUT);
