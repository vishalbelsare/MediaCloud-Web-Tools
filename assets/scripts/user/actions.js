import { createAction } from 'redux-actions';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
