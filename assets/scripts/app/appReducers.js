import { OPEN_LEFT_NAV, DOCK_LEFT_NAV } from './appActions';
import { handleActions } from 'redux-actions';

const INITIAL_STATE = {
  leftNav: {
    open: false,
    docked: false,
  },
};

const app = handleActions({
  OPEN_LEFT_NAV: (state, action) => ({
    leftNav: {
      open: action.payload,
      docked: state.leftNav.docked,
    },
  }),
  DOCK_LEFT_NAV: (state, action) => ({
    leftNav: {
      open: state.leftNav.open,
      docked: action.payload,
    },
  }),
}, INITIAL_STATE);

export default app;
