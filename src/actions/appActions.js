import { createAction } from 'redux-actions';

export const SET_BRAND_MASTHEAD_TEXT = 'SET_BRAND_MASTHEAD_TEXT';
export const UPDATE_FEEDBACK = 'UPDATE_FEEDBACK';

// pass in a string to put in the masthead instead of the app name
export const setBrandMastheadText = createAction(SET_BRAND_MASTHEAD_TEXT, mastheadText => mastheadText);

// pass in an object with open and message properties
export const updateFeedback = createAction(UPDATE_FEEDBACK, feedbackInfo => feedbackInfo);
