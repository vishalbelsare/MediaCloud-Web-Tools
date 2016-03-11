import { LEFT_NAV_VISIBILITY } from './actions';
import { handleActions } from 'redux-actions';

const app = handleActions({
  LEFT_NAV_VISIBILITY: (state, action) => ({
    ...state,
    isLeftNavOpen: action.payload
  })
}, { isLeftNavOpen: false });

export default app;