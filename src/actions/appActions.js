import { createAction } from 'redux-actions';

export const SET_BRAND_MASTHEAD_TEXT = 'SET_BRAND_MASTHEAD_TEXT';
export const UPDATE_SNACK_BAR = 'UPDATE_SNACK_BAR';

// pass in a string to put in the masthead instead of the app name
export const setBrandMastheadText = createAction(SET_BRAND_MASTHEAD_TEXT, mastheadText => mastheadText);

// pass in an object with open and message properties
export const updateSnackBar = createAction(UPDATE_SNACK_BAR, snackBarInfo => snackBarInfo);
