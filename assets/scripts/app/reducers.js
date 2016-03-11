import { LEFT_NAV_VISIBILITY } from './actions';

function app(state = {isLeftNavOpen:false}, action) {
  switch (action.type) {
  case LEFT_NAV_VISIBILITY:
    return {
    	...state,
    	isLeftNavOpen: action.visible
    };
  default:
    return state;
  }
}

export default app;