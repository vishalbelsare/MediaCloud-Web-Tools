import { createAction } from 'redux-actions';
import * as api from '../lib/serverApi/user';
import { createAsyncAction } from '../lib/reduxHelpers';

export const LOGIN_WITH_PASSWORD = 'LOGIN_WITH_PASSWORD';
export const LOGIN_WITH_KEY = 'LOGIN_FROM_KEY';
export const LOGOUT = 'LOGOUT';
export const SET_LOGIN_ERROR_MESSAGE = 'SET_LOGIN_ERROR_MESSAGE';

// pass in email and key
export const loginWithKey = createAsyncAction(LOGIN_WITH_KEY, api.loginWithKey);

// pass in email and password
export const loginWithPassword = createAsyncAction(LOGIN_WITH_PASSWORD, api.loginWithPassword);

export const setLoginErrorMessage = createAction(SET_LOGIN_ERROR_MESSAGE, msg => msg);

export const logout = createAction(LOGOUT);
