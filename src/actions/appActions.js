import { createAction } from 'redux-actions';

export const SET_BRAND_MASTHEAD_TEXT = 'SET_BRAND_MASTHEAD_TEXT';
export const UPDATE_FEEDBACK = 'UPDATE_FEEDBACK';
export const ADD_NOTICE = 'ADD_NOTICE';
export const DISMISS_NOTICES = 'DISMISS_NOTICES';

// pass in a string to put in the masthead instead of the app name
export const setBrandMastheadText = createAction(SET_BRAND_MASTHEAD_TEXT, mastheadText => mastheadText);

// pass in an object with open and message properties
export const updateFeedback = createAction(UPDATE_FEEDBACK, feedbackInfo => feedbackInfo);

// pass in an error object with a "message" property and a "level"
export const addNotice = createAction(ADD_NOTICE, info => info);

export const dismissNotices = createAction(DISMISS_NOTICES);
