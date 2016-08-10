import { createAction } from 'redux-actions';

export const SET_BRAND_MASTHEAD_TEXT = 'SET_BRAND_MASTHEAD_TEXT';
export const LOGIN_WITH_KEY = 'LOGIN_FROM_KEY';
export const LOGOUT = 'LOGOUT';

export const setBrandMastheadText = createAction(SET_BRAND_MASTHEAD_TEXT, mastheadText => mastheadText);
