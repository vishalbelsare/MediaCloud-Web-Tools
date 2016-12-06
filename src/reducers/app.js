import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_BRAND_MASTHEAD_TEXT, UPDATE_FEEDBACK,
  DISMISS_ERRORS, ADD_ERROR } from '../actions/appActions';
import { createReducer } from '../lib/reduxHelpers';

const INITIAL_STATE = {
  mastheadText: null,
  feedback: {
    open: false,
    message: '',
  },
  errors: [],
};

const app = createReducer({
  initialState: INITIAL_STATE,
  [SET_BRAND_MASTHEAD_TEXT]: payload => ({ mastheadText: payload }),
  [UPDATE_FEEDBACK]: payload => ({ feedback: payload }),
  [ADD_ERROR]: (payload, state) => ({ errors: [...state.errors, payload] }),
  [DISMISS_ERRORS]: () => ({ errors: [] }),
  [LOCATION_CHANGE]: () => ({ errors: [] }),  // empty out errors when the user switches pages
});

export default app;
