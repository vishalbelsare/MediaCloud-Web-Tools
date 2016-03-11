import { createAction } from 'redux-actions';

export const LEFT_NAV_VISIBILITY = 'LEFT_NAV_VISIBILITY';

let leftNavVisibility = createAction(LEFT_NAV_VISIBILITY);

export default leftNavVisibility;