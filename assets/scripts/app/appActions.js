import {createAction} from 'redux-actions';

export const LEFT_NAV_VISIBILITY = 'LEFT_NAV_VISIBILITY';

// takes a boolean argument indicating if it is open or not
let leftNavVisibility = createAction(LEFT_NAV_VISIBILITY);

export default leftNavVisibility;