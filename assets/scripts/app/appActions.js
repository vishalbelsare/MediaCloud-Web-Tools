import { createAction } from 'redux-actions';

export const OPEN_LEFT_NAV = 'OPEN_LEFT_NAV';
export const DOCK_LEFT_NAV = 'DOCK_LEFT_NAV';

export const openLeftNav = createAction(OPEN_LEFT_NAV);

export const dockLeftNav = createAction(DOCK_LEFT_NAV);
